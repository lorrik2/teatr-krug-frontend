"use client";

import Link from "next/link";
import Image from "next/image";
import type { CastMember } from "@/lib/mock-data";
import { actors } from "@/lib/mock-data";
import styles from "./PerformanceCast.module.css";

export default function PerformanceCast({ cast }: { cast: CastMember[] }) {
  return (
    <ul className={styles.list}>
      {cast.map((member, i) => {
        const actor = member.actorSlug
          ? actors.find((a) => a.slug === member.actorSlug)
          : null;
        const photo = actor?.photo;

        const content = (
          <>
            <div className={styles.photoWrap}>
              {photo ? (
                <Image
                  src={photo}
                  alt={member.name}
                  width={256}
                  height={256}
                  className={styles.photo}
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
            {actor ? (
              <Link
                href={`/team/${actor.slug}`}
                className={styles.link}
                aria-label={`${member.name} — ${member.role}`}
              >
                {content}
              </Link>
            ) : (
              <div className={styles.link}>{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
