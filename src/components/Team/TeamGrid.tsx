"use client";

import { useState } from "react";
import Link from "next/link";
import OptimizedImage from "@/components/OptimizedImage";
import ActorRolesModal from "@/components/ActorRolesModal";
import type { Actor, Performance } from "@/lib/mock-data";
import {
  isDirectorOrArtisticDirector,
  getActorPerformanceRoles,
} from "@/lib/actor-utils";
import styles from "../../app/team/TeamPage.module.css";

export default function TeamGrid({
  actors,
  performances,
}: {
  actors: Actor[];
  performances: Performance[];
}) {
  const [modalActor, setModalActor] = useState<{
    actor: Actor;
    performanceRoles: { title: string; slug: string; role: string }[];
  } | null>(null);

  return (
    <>
      <ul className={styles.teamGrid}>
        {actors.map((actor) => {
          const isDirector = isDirectorOrArtisticDirector(actor);
          const showLink = isDirector;
          const showModal = !showLink;

          const cardContent = (
            <>
              <div className={styles.photoWrap}>
                <OptimizedImage
                  src={actor.photo}
                  alt={actor.name}
                  width={400}
                  height={500}
                  className={styles.photo}
                  effect="blur"
                />
              </div>
              <div className={styles.body}>
                <h2 className={styles.name}>{actor.name}</h2>
                {actor.rank && <p className={styles.rank}>{actor.rank}</p>}
                <p className={styles.role}>{actor.role}</p>
                {showLink && <span className={styles.detailBtn}>Подробнее</span>}
                {showModal && (
                  <span className={styles.detailBtn}>
                    Роли в спектаклях
                  </span>
                )}
              </div>
            </>
          );

          return (
            <li key={actor.id} className={styles.card}>
              {showLink ? (
                <Link
                  href={`/team/${actor.slug}`}
                  className={`${styles.cardLink} ${styles.cardLinkClickable}`}
                >
                  {cardContent}
                </Link>
              ) : (
                <button
                  type="button"
                  className={`${styles.cardLink} ${styles.cardLinkClickable}`}
                  onClick={() =>
                    setModalActor({
                      actor,
                      performanceRoles: getActorPerformanceRoles(
                        actor.slug,
                        performances
                      ),
                    })
                  }
                  aria-label={`${actor.name} — роли в спектаклях`}
                >
                  {cardContent}
                </button>
              )}
            </li>
          );
        })}
      </ul>
      {modalActor && (
        <ActorRolesModal
          name={modalActor.actor.name}
          photo={modalActor.actor.photo}
          role={modalActor.actor.role}
          performanceRoles={modalActor.performanceRoles}
          isOpen={!!modalActor}
          onClose={() => setModalActor(null)}
        />
      )}
    </>
  );
}
