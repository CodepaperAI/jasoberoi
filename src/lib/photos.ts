/**
 * What each photograph actually shows.
 *
 * This file exists because the filenames lie, and everything downstream trusted
 * them. Five of the thirty-six assets are named for the opposite of their
 * subject:
 *
 *   project-med-spa.jpg        → a luxury house exterior (same house as
 *                                project-luxury-live.jpg)
 *   project-commercial-13.jpg  → a luxury house at dusk with a sports car
 *   hero-commercial.webp       → the same luxury house at dusk
 *   project-office.jpg         → The Shine Dental reception, a clinic
 *   project-residential.jpg    → the White Rock private office lounge
 *
 * The hero pools keyed off those names, so a villa headed the pharmacy cost
 * guide, the clinic-renovation service hub and twelve healthcare city pages,
 * and the dusk mansion was the site-wide Open Graph image — the picture every
 * dental and medical page shared as.
 *
 * Renaming the files would have broken every Open Graph URL already indexed, so
 * the names stay and the truth lives here instead. `subject` is the verified
 * content of the frame, confirmed by looking at all thirty-six. Nothing else in
 * the codebase may reference a bare filename to decide what a picture depicts —
 * pools, service images and page heroes all resolve through this module, and
 * scripts/check-trust.mjs fails the build on any page that renders a subject its
 * vertical does not allow.
 */

/**
 * What is in the frame. Not the vertical it is allowed to serve — see below.
 *
 * "Brand" is the logo. It is registered so the coverage sweep in check-trust
 * can insist every image path in src is accounted for, and it appears in no
 * vertical's allowed list, so using it as a page hero fails the build.
 */
export type PhotoSubject = "Clinic" | "Office" | "Home" | "Brand";

export type Photo = {
  /** Filename under public/oberizon/optimized. */
  file: string;
  /** Verified content of the photograph. */
  subject: PhotoSubject;
  /**
   * What a screen reader hears, and what an image search indexes.
   *
   * Every hero previously rendered alt="" on the grounds that pool-dealt
   * photographs were decorative. That was true only while the pool could hand a
   * clinic post a picture of a house; now that a post is guaranteed a
   * subject-correct frame, describing it is both accurate and worth the image
   * traffic.
   */
  alt: string;
};

export const imageBase = "/oberizon/optimized";

/** Path for a registry filename. */
export const photoPath = (file: string) => `${imageBase}/${file}`;

export const photos: Photo[] = [
  // ---- Delivered client photography, 2026-08-05 -------------------------
  {
    file: "project-shine-dental-reception-live.jpg",
    subject: "Clinic",
    alt: "Reception desk and branded signage at The Shine Dental, a completed dental clinic build in White Rock, BC",
  },
  {
    file: "project-shine-dental-operatory-live.jpg",
    subject: "Clinic",
    alt: "Finished dental operatory with chair, overhead light and service cabinetry at The Shine Dental, White Rock",
  },
  {
    file: "project-shine-dental-sterilization-live.jpg",
    subject: "Clinic",
    alt: "Sterilization bay with cabinetry and equipment at The Shine Dental, White Rock",
  },
  {
    file: "project-shine-dental-live.jpg",
    subject: "Clinic",
    alt: "Slatted timber ceiling and front-of-house at The Shine Dental, White Rock",
  },
  {
    file: "project-abby-dental-reception-live.jpg",
    subject: "Clinic",
    alt: "Reception and waiting area at the Marshall Road dental clinic, Abbotsford, BC",
  },
  {
    file: "project-abby-dental-operatory-live.jpg",
    subject: "Clinic",
    alt: "Completed dental operatory at the Marshall Road dental clinic, Abbotsford, BC",
  },
  {
    file: "project-abby-dental-corridor-live.jpg",
    subject: "Clinic",
    alt: "Treatment room corridor at the Marshall Road dental clinic, Abbotsford, BC",
  },
  {
    file: "project-abby-dental-sterilization-live.jpg",
    subject: "Clinic",
    alt: "Sterilization bay and instrument cabinetry at the Marshall Road dental clinic, Abbotsford, BC",
  },
  {
    file: "project-abby-dental-live.jpg",
    subject: "Clinic",
    alt: "Reception desk and timber slat wall at the Marshall Road dental clinic, Abbotsford, BC",
  },
  {
    file: "project-kanwarveer-reception-live.jpg",
    subject: "Clinic",
    alt: "Reception desk and timber slat wall at Dr. Kanwarveer Family Dentist Clinic",
  },
  {
    file: "project-kanwarveer-operatory-live.jpg",
    subject: "Clinic",
    alt: "Finished dental operatory at Dr. Kanwarveer Family Dentist Clinic",
  },
  {
    file: "project-kanwarveer-corridor-live.jpg",
    subject: "Clinic",
    alt: "Operatory corridor at Dr. Kanwarveer Family Dentist Clinic",
  },
  {
    file: "project-kanwarveer-sterilization-live.jpg",
    subject: "Clinic",
    alt: "Sterilization bay at Dr. Kanwarveer Family Dentist Clinic",
  },
  {
    file: "project-skinholic-reception-live.jpg",
    subject: "Clinic",
    alt: "Reception desk and arched millwork at Skinholic Aesthetics medical spa, Abbotsford, BC",
  },
  {
    file: "project-skinholic-feature-wall-live.jpg",
    subject: "Clinic",
    alt: "Feature wall and finish detail at Skinholic Aesthetics medical spa, Abbotsford, BC",
  },
  {
    file: "project-skinholic-lobby-live.jpg",
    subject: "Clinic",
    alt: "Lobby and reception at Skinholic Aesthetics medical spa, Abbotsford, BC",
  },
  {
    file: "project-skinholic-treatment-live.jpg",
    subject: "Clinic",
    alt: "Treatment room with vanity, sink and shower at Skinholic Aesthetics medical spa, Abbotsford, BC",
  },
  {
    file: "project-skinholic-alcove-live.jpg",
    subject: "Clinic",
    alt: "Millwork alcove with open shelving at Skinholic Aesthetics medical spa, Abbotsford, BC",
  },
  {
    /*
      Filed by the client as the "Private office build, White Rock" and kept on
      that project's card, where the caption gives it context.

      Classified Home for image purposes anyway, because that is what the frame
      shows: a wet bar with a wine rack and wine fridge, decanters, whisky
      glasses, leather armchairs, a sofa and a throw pillow. No desk, no
      workstation, no meeting table. On an "office renovation contractor" page
      a visitor reads that as somebody's house, which is the complaint this
      whole registry exists to answer — so it does not head commercial pages.

      TODO(client): confirm whether this room is the private office or a
      residential lounge. checkProjectPhotoSubjects warns on it every build.
    */
    file: "project-private-office-live.jpg",
    subject: "Home",
    alt: "Lounge and bar millwork in a completed Oberizon interior, White Rock, BC",
  },
  {
    file: "project-luxury-live.jpg",
    subject: "Home",
    alt: "Completed luxury home exterior at the West Cordova residential build, Vancouver, BC",
  },

  // ---- Clinic interiors ------------------------------------------------
  {
    file: "dental-clinic.jpg",
    subject: "Clinic",
    alt: "Reception and waiting area at The Shine Dental, White Rock, BC",
  },
  {
    file: "project-dental-1.jpg",
    subject: "Clinic",
    alt: "Reception desk and storage cabinetry in a completed dental clinic build",
  },
  {
    file: "project-clinic-9.jpg",
    subject: "Clinic",
    alt: "Glass-walled operatory corridor in a completed dental clinic",
  },
  {
    file: "project-clinic-10.jpg",
    subject: "Clinic",
    alt: "Dental operatory with chair, overhead light and service cabinetry",
  },
  {
    file: "project-clinic-11.jpg",
    subject: "Clinic",
    alt: "Sterilization bay with sink, cabinetry and instrument storage in a finished clinic",
  },
  {
    file: "project-clinic-12.jpg",
    subject: "Clinic",
    alt: "Clinic corridor looking through to a completed dental operatory",
  },
  {
    file: "project-healthcare-3.jpg",
    subject: "Clinic",
    alt: "Reception desk and arched display millwork in a completed medical clinic",
  },
  {
    file: "project-healthcare-4.jpg",
    subject: "Clinic",
    alt: "Consultation room with desk and arched shelving in a completed clinic",
  },
  {
    file: "project-healthcare-5.jpg",
    subject: "Clinic",
    alt: "Clinic prep alcove with sink, cabinetry and open shelving",
  },
  {
    // Named for commercial work; it is clinic millwork and an exam room beyond.
    file: "project-commercial-2.jpg",
    subject: "Clinic",
    alt: "Arched millwork storage and reception counter in a completed clinic build",
  },
  {
    // Named for an office; it is The Shine Dental reception.
    file: "project-office.jpg",
    subject: "Clinic",
    alt: "Slatted timber ceiling above the reception at The Shine Dental, White Rock, BC",
  },
  {
    file: "reception.jpg",
    subject: "Clinic",
    alt: "Timber-slat reception desk in a completed clinic interior",
  },

  // ---- Custom homes, client photography 2026-09-02 ---------------------
  /*
    The residential library was two exterior shots of the same two houses and
    nothing of an interior, which is why the residential page had to lead on a
    driveway. These are the finished rooms.
  */
  {
    file: "project-custom-home-exterior-live.jpg",
    subject: "Home",
    alt: "Completed custom home lit at dusk, with gated entry and cedar soffits",
  },
  {
    file: "project-custom-home-living-live.jpg",
    subject: "Home",
    alt: "Living and dining room of a completed custom home, with a tiered chandelier, cedar feature wall and open-riser staircase",
  },
  {
    file: "project-custom-home-lounge-live.jpg",
    subject: "Home",
    alt: "Living room of a completed custom home, with a linear fireplace set into a stone feature wall and walnut slat joinery",
  },

  // ---- Brand -----------------------------------------------------------
  {
    file: "oberizon-logo.png",
    subject: "Brand",
    alt: "Oberizon Construction",
  },

  // ---- Residential -----------------------------------------------------
  {
    // Named for a med spa; it is the same luxury house as project-luxury-live.
    file: "project-med-spa.jpg",
    subject: "Home",
    alt: "Front elevation and garage of a completed luxury home in Metro Vancouver",
  },
  {
    // Named for commercial work; it is a luxury house at dusk.
    file: "project-commercial-13.jpg",
    subject: "Home",
    alt: "Completed luxury home lit at dusk in Metro Vancouver",
  },
  {
    // The site-wide Open Graph default until now. Also the luxury house.
    file: "hero-commercial.webp",
    subject: "Home",
    alt: "Completed luxury home lit at dusk in Metro Vancouver",
  },
  {
    // The same lounge as project-private-office-live.jpg, re-encoded.
    file: "project-residential.jpg",
    subject: "Home",
    alt: "Seating and bar millwork in a completed Oberizon residential interior",
  },
];

const byPath = new Map(photos.map((photo) => [photoPath(photo.file), photo]));

/** The registry entry for a rendered path, if it is a registered photograph. */
export function photoFor(path: string): Photo | undefined {
  return byPath.get(path);
}

/**
 * Alt text for a rendered path.
 *
 * Falls back to empty rather than to a guess: an unregistered image is better
 * announced as decorative than described wrongly.
 */
export function altFor(path: string): string {
  return byPath.get(path)?.alt ?? "";
}

/** Every registered path with the given subject, in registry order. */
export function photosOf(subject: PhotoSubject): string[] {
  return photos.filter((photo) => photo.subject === subject).map((photo) => photoPath(photo.file));
}

/**
 * Which subjects each vertical may show.
 *
 * Healthcare takes clinics only — the complaint that started this was a villa
 * heading a dental page, and no house belongs on one.
 *
 * Commercial takes clinic interiors, because a clinic fit-out *is* a commercial
 * tenant improvement and receptions, lobbies and corridors read as professional
 * interiors rather than as clinical ones. "Office" stays in the type but no
 * photograph currently carries it: the one asset filed as an office is the bar
 * lounge above. Oberizon has no photographed office fit-out, and until it does
 * these pages show the real interiors rather than a stock office or a house.
 *
 * Residential takes homes only.
 */
export const allowedSubjects: Record<"Healthcare" | "Commercial" | "Residential", PhotoSubject[]> = {
  Healthcare: ["Clinic"],
  Commercial: ["Office", "Clinic"],
  Residential: ["Home"],
};

/** True when `path` may head a page in `vertical`. Unregistered paths pass. */
export function subjectAllowed(
  vertical: "Healthcare" | "Commercial" | "Residential",
  path: string,
): boolean {
  const photo = byPath.get(path);
  if (!photo) return true;
  return allowedSubjects[vertical].includes(photo.subject);
}
