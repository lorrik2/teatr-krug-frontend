"use client";

import { useState } from "react";
import Link from "next/link";
import OptimizedImage from "@/components/OptimizedImage";
import ActorRolesModal from "@/components/ActorRolesModal";
import type { CastMember, Actor, Performance } from "@/lib/mock-data";
import {
  isDirectorOrArtisticDirector,
  getActorPerformanceRoles,
} from "@/lib/actor-utils";
import styles from "./PerformanceCast.module.css";

export default function PerformanceCast({
  cast,
  actors = [],
  performances = [],
}: {
  cast: CastMember[];
  actors?: Actor[];
  performances?: Performance[];
}) {
  const [modalActor, setModalActor] = useState<{
    actor: Actor;
    performanceRoles: { title: string; slug: string; role: string }[];
  } | null>(null);

  return (
    <>
      <ul className={styles.list}>
        {cast.map((member, i) => {
          const actor = member.actorSlug
            ? actors.find((a) => a.slug === member.actorSlug)
            : null;
          const photo = actor?.photo;
          const isDirector =
            actor && isDirectorOrArtisticDirector(actor);
          const showLink = !!isDirector;
          const showModal = actor && !showLink;

          const content = (
            <>
              <div className={styles.photoWrap}>
                {photo ? (
                  <OptimizedImage
                    src={photo}
                    alt={member.name}
                    width={256}
                    height={256}
                    className={styles.photo}
                    effect="blur"
                  />
                ) : (
                  <span className={styles.placeholder}>{member.name[0]}</span>
                )}
              </div>
              <div className={styles.body}>
                <span className={styles.name}>{member.name}</span>
                <span className={styles.role}>{member.role}</span>
              </div>
            </>
          );

          return (
            <li key={i} className={styles.item}>
              {showLink ? (
                <Link
                  href={`/team/${actor!.slug}`}
                  className={`${styles.link} ${styles.linkClickable}`}
                  aria-label={`${member.name} — ${member.role}`}
                >
                  {content}
                </Link>
              ) : showModal ? (
                <button
                  type="button"
                  className={`${styles.link} ${styles.linkClickable}`}
                  onClick={() =>
                    setModalActor({
                      actor: actor!,
                      performanceRoles: getActorPerformanceRoles(
                        actor!.slug,
                        performances
                      ),
                    })
                  }
                  aria-label={`${member.name} — ${member.role}. Показать роли`}
                >
                  {content}
                </button>
              ) : (
                <div className={styles.linkStatic}>{content}</div>
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
