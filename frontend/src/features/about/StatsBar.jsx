import React from "react";
import { motion } from "framer-motion";
import {
  Clock,
  GitBranch,
  Star,
  Package,
  ArrowRight,
  ZoomIn,
  MapPin,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ExternalLink,
  UserRound,
  Download,
} from "lucide-react";

import { SectionHeader } from "@/shared/components/SectionHeader.jsx";
import { Button } from "@/shared/ui/Button.jsx";
import { Modal } from "@/shared/ui/Modal.jsx";
import { CardContent, CardTitle, CardDescription } from "@/shared/ui/Card.jsx";
import { useModal } from "@/shared/hooks/useModal.js";
import { useSiteContent } from "@/shared/hooks/useSiteContent.js";
import { getYearsOfExperience } from "./experience.util.js";
import { GITHUB_STATS } from "@/constants/githubStats.constants.js";
import { ABOUT_DEFAULTS } from "@/constants/siteContent.defaults.js";
import { scrollToSection } from "@/shared/hooks/useSectionScroll.js";

import profilePhoto from "@/assets/images/me.jpg";
import companyLogo from "@/assets/images/hih7-logo.webp";

/* -------------------------------------------------------------------------- */
/* DATA                                                                       */
/* -------------------------------------------------------------------------- */

const STATS = [
  {
    label: "of Experience",
    value: getYearsOfExperience(),
    icon: <Clock size={23} strokeWidth={1.8} />,
  },
  {
    label: "Public Repos",
    value: `${GITHUB_STATS.repoCount}+`,
    icon: <GitBranch size={23} strokeWidth={1.8} />,
  },
  {
    label: "GitHub Stars",
    value: `${GITHUB_STATS.totalStars}`,
    icon: <Star size={23} strokeWidth={1.8} />,
  },
  {
    label: "OSS Packages",
    value: `${GITHUB_STATS.npmPackages}`,
    icon: <Package size={23} strokeWidth={1.8} />,
  },
];

// Icons/labels/order are fixed layout — only the values are admin-editable
// (see useSiteContent("about", ...) in StatsBar below).
const getDetailRows = (content) => [
  { label: "Name", value: content.name, icon: <UserRound size={14} /> },
  { label: "Role", value: content.role, icon: <BriefcaseBusiness size={14} /> },
  { label: "Company", value: content.company, icon: <Building2 size={14} /> },
  { label: "Location", value: content.location, icon: <MapPin size={14} /> },
  { label: "Since", value: content.since, icon: <CalendarDays size={14} /> },
];

/* -------------------------------------------------------------------------- */
/* STAT CARD                                                                  */
/* -------------------------------------------------------------------------- */

const StatCard = ({ stat, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: index * 0.07,
      }}
      viewport={{ once: true }}
      className="
        group
        relative
        overflow-hidden
        h-full
        min-h-[145px]
        rounded-2xl
        border
        border-glass-border
        bg-surface/60
        backdrop-blur-xl
        flex
        flex-col
        items-center
        justify-center
        text-center
        transition-all
        duration-300
        hover:border-accent/40
        hover:-translate-y-1
      "
    >
      {/* Decorative orbital rings */}
      <div
        className="
          pointer-events-none
          absolute
          w-[150px]
          h-[150px]
          rounded-full
          border
          border-accent/10
          group-hover:border-accent/20
          transition-colors
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          w-[118px]
          h-[118px]
          rounded-full
          border
          border-accent/10
        "
      />

      {/* Small orbit dots */}
      <span
        className="
          absolute
          top-1/2
          -translate-y-1/2
          -translate-x-1/2
          left-[calc(50%-59px)]
          w-1.5
          h-1.5
          rounded-full
          bg-accent
          shadow-[0_0_10px_var(--accent-glow)]
        "
      />

      <span
        className="
          absolute
          top-1/2
          -translate-y-1/2
          translate-x-1/2
          right-[calc(50%-59px)]
          w-1.5
          h-1.5
          rounded-full
          bg-accent
          shadow-[0_0_10px_var(--accent-glow)]
        "
      />

      {/* Icon */}
      <div
        className="
          relative
          z-10
          w-12
          h-12
          rounded-xl
          border
          border-accent/40
          bg-surface
          text-accent
          flex
          items-center
          justify-center
          shadow-[0_0_18px_var(--accent-glow)]
          mb-3
          transition-transform
          duration-300
          group-hover:scale-105
        "
      >
        {stat.icon}
      </div>

      {/* Value */}
      <span
        className="
          relative
          z-10
          font-header
          font-black
          text-primary
          text-3xl
          sm:text-4xl
          leading-none
        "
      >
        {stat.value}
      </span>

      {/* Label */}
      <span
        className="
          relative
          z-10
          mt-2
          text-accent
          font-mono
          text-[9px]
          sm:text-[10px]
          uppercase
          tracking-[0.22em]
          font-semibold
        "
      >
        {stat.label}
      </span>
    </motion.div>
  );
};

/* -------------------------------------------------------------------------- */
/* CURRENT COMPANY CARD                                                       */
/* -------------------------------------------------------------------------- */

const CurrentCompanyCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.2 }}
      viewport={{ once: true }}
      className="
        relative
        overflow-hidden
        rounded-2xl
        border
        border-glass-border
        bg-surface/60
        backdrop-blur-xl
        p-5
        sm:p-6
      "
    >
      {/* Top label */}
      <div className="mb-4">
        <span
          className="
            text-accent
            font-mono
            text-[10px]
            uppercase
            tracking-[0.2em]
            font-semibold
          "
        >
          Currently Working At
        </span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-5">
        {/* Company identity */}
        <div className="flex items-center gap-4 min-w-0 md:min-w-[290px]">
          {/* Logo */}
          <a
            href="https://hih7.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Hi7 Webtech website"
            className="
              interactive
              group/logo
              shrink-0
              w-[78px]
              h-[78px]
              rounded-xl
              border
              border-accent/30
              bg-[#0a0a0a]
              flex
              items-center
              justify-center
              overflow-hidden
              shadow-[0_0_20px_var(--accent-glow)]
              transition-all
              duration-300
              hover:border-accent
              hover:shadow-[0_0_28px_var(--accent-glow)]
            "
          >
            <img
              src={companyLogo}
              alt="Hi7 Webtech Pvt Ltd"
              className="
                w-full
                h-full
                object-contain
                p-2
                transition-transform
                duration-300
                group-hover/logo:scale-105
              "
            />
          </a>

          {/* Company text */}
          <div className="min-w-0">
            <a
              href="https://hih7.com"
              target="_blank"
              rel="noopener noreferrer"
              className="
                interactive
                group/company
                inline-flex
                items-center
                gap-2
                text-primary
                font-header
                font-bold
                text-lg
                sm:text-xl
                hover:text-accent
                transition-colors
              "
            >
              Hi7 Webtech Pvt Ltd

              <ExternalLink
                size={14}
                className="
                  text-accent
                  opacity-60
                  group-hover/company:opacity-100
                  transition-opacity
                "
              />
            </a>

            <p
              className="
                mt-1
                text-muted
                font-mono
                text-[11px]
              "
            >
              MERN Stack Developer
            </p>

            <div className="mt-3 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-muted text-xs">
                <MapPin size={13} className="text-accent shrink-0" />
                <span>Kolkata, West Bengal, India</span>
              </div>

              <div className="flex items-center gap-2 text-muted text-xs">
                <CalendarDays size={13} className="text-accent shrink-0" />
                <span>Nov 2024 – Present</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className="
            hidden
            md:block
            w-px
            h-20
            bg-glass-border
          "
        />

        {/* Description */}
        <div className="flex-1">
          <p
            className="
              text-muted
              text-sm
              leading-relaxed
              max-w-xl
            "
          >
            Building a real-time golf course business management platform
            with multi-level access control
            <span className="text-primary">
              {" "}
              (Admin → Business Owner → Golf Course).
            </span>
          </p>

          <a
            href="https://hih7.com"
            target="_blank"
            rel="noopener noreferrer"
            className="
              interactive
              inline-flex
              items-center
              gap-2
              mt-4
              text-accent
              font-mono
              text-[10px]
              uppercase
              tracking-[0.18em]
              font-semibold
              hover:gap-3
              transition-all
            "
          >
            Visit Company
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

/* -------------------------------------------------------------------------- */
/* MAIN COMPONENT                                                             */
/* -------------------------------------------------------------------------- */

export const StatsBar = () => {
  const photoModal = useModal();
  const content = useSiteContent("about", ABOUT_DEFAULTS);
  const detailRows = getDetailRows(content);

  return (
    <section
      id="about"
      className="container mx-auto px-6 md:px-12 py-10 md:py-14 min-h-svh flex flex-col justify-center text-primary border-b border-glass-border"
    >
      {/* ------------------------------------------------------------------ */}
      {/* HEADER                                                              */}
      {/* ------------------------------------------------------------------ */}

      <SectionHeader
        compact
        title="About Me"
        subtitle={content.sectionSubtitle}
      />

      {/* ------------------------------------------------------------------ */}
      {/* MAIN GRID                                                           */}
      {/* ------------------------------------------------------------------ */}

      <div
        className="
          grid
          gap-5
          lg:gap-6

          lg:grid-cols-[minmax(0,1.03fr)_minmax(0,1fr)]

          items-stretch
        "
      >
        {/* ================================================================= */}
        {/* LEFT PROFILE CARD                                                 */}
        {/* ================================================================= */}

        <motion.div
          initial={{ opacity: 0, x: -25 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="
            relative
            overflow-hidden
            rounded-2xl
            border
            border-glass-border
            bg-surface/60
            backdrop-blur-xl

            p-5
            sm:p-6
            lg:p-6

            flex
            flex-col
          "
        >
          {/* Decorative orbital lines behind photo */}
          <div
            className="
              pointer-events-none
              absolute
              hidden
              sm:block
              left-[-35px]
              bottom-[80px]
              w-[280px]
              h-[280px]
              rounded-full
              border
              border-accent/10
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              hidden
              sm:block
              left-[-15px]
              bottom-[100px]
              w-[240px]
              h-[240px]
              rounded-full
              border
              border-accent/10
            "
          />

          <div className="relative z-10 flex-1">
            {/* Photo + information */}
            <div
              className="
                flex
                flex-col
                sm:flex-row
                gap-5
                lg:gap-7
                items-center
                sm:items-start
              "
            >
              {/* PHOTO */}
              <div className="relative shrink-0">
                <button
                  onClick={photoModal.open}
                  aria-label="Enlarge profile photo"
                  className="
                    interactive
                    group
                    relative
                    block
                  "
                >
                  <img
                    src={profilePhoto}
                    alt="Sayantan Chakraborty"
                    className="
                      w-36
                      sm:w-40
                      lg:w-44

                      aspect-[3/4]

                      rounded-2xl
                      object-cover

                      border
                      border-accent/40

                      grayscale

                      group-hover:grayscale-0

                      transition-all
                      duration-500
                    "
                  />

                  {/* Hover overlay */}
                  <span
                    className="
                      absolute
                      inset-0
                      rounded-2xl
                      bg-bg/60
                      opacity-0
                      group-hover:opacity-100
                      flex
                      items-center
                      justify-center
                      transition-opacity
                      duration-300
                    "
                  >
                    <ZoomIn
                      size={22}
                      className="text-accent"
                    />
                  </span>
                </button>

                {/* Floating profile icon */}
                <span
                  className="
                    absolute
                    -top-2
                    -right-2

                    w-9
                    h-9

                    rounded-full

                    bg-accent
                    text-bg

                    flex
                    items-center
                    justify-center

                    shadow-[0_0_18px_var(--accent-glow)]
                  "
                >
                  <UserRound size={16} />
                </span>

                {/* Download CV */}
                {/* <a
                  href="/resume.pdf"
                  download
                  className="
                    interactive

                    absolute
                    left-1/2
                    -translate-x-1/2
                    -bottom-4

                    whitespace-nowrap

                    inline-flex
                    items-center
                    justify-center
                    gap-2

                    px-5
                    py-2.5

                    rounded-xl

                    bg-accent
                    text-bg

                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.14em]

                    shadow-[0_5px_18px_var(--accent-glow)]

                    hover:brightness-110
                    transition
                  "
                >
                  <Download size={13} />
                  Download CV
                </a> */}
              </div>

              {/* DESCRIPTION */}
              <div className="flex-1 pt-1 sm:pt-2 w-full">
                <CardTitle className="mb-2 text-xl lg:text-2xl">
                  {content.roleTitle}
                </CardTitle>

                <CardDescription
                  className="
                    mb-3
                    text-sm
                    lg:text-[15px]
                    leading-relaxed
                  "
                >
                  {content.shortBio}
                </CardDescription>

                <div className="border-t border-glass-border pt-3 space-y-2">
                  {/* Company */}
                  <div className="flex items-center gap-4 min-w-0 md:min-w-[290px]">
          {/* Logo */}
          <a
            href="https://hih7.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Hi7 Webtech website"
            className="
              interactive
              group/logo
              shrink-0
              w-[78px]
              h-[78px]
              rounded-xl
              border
              border-accent/30
              bg-[#0a0a0a]
              flex
              items-center
              justify-center
              overflow-hidden
              shadow-[0_0_20px_var(--accent-glow)]
              transition-all
              duration-300
              hover:border-accent
              hover:shadow-[0_0_28px_var(--accent-glow)]
            "
          >
            <img
              src={companyLogo}
              alt="Hi7 Webtech Pvt Ltd"
              className="
                w-full
                h-full
                object-contain
                p-2
                transition-transform
                duration-300
                group-hover/logo:scale-105
              "
            />
          </a>

          {/* Company text */}
          <div className="min-w-0">
            <a
              href="https://hih7.com"
              target="_blank"
              rel="noopener noreferrer"
              className="
                interactive
                group/company
                inline-flex
                items-center
                gap-2
                text-primary
                font-header
                font-bold
                text-lg
                sm:text-xl
                hover:text-accent
                transition-colors
              "
            >
              Hi7 Webtech Pvt Ltd

              <ExternalLink
                size={14}
                className="
                  text-accent
                  opacity-60
                  group-hover/company:opacity-100
                  transition-opacity
                "
              />
            </a>

            <p
              className="
                mt-1
                text-muted
                font-mono
                text-[11px]
              "
            >
              MERN Stack Developer
            </p>

            <div className="mt-3 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-muted text-xs">
                <MapPin size={13} className="text-accent shrink-0" />
                <span>Kolkata, West Bengal, India</span>
              </div>

              <div className="flex items-center gap-2 text-muted text-xs">
                <CalendarDays size={13} className="text-accent shrink-0" />
                <span>Nov 2024 – Present</span>
              </div>
            </div>
          </div>
        </div>
                  

                  
                  
                </div>
              </div>
            </div>
          </div>

          {/* Bottom action */}
          <div className="relative z-10 mt-6 sm:mt-8 flex justify-between ">
            <Button
              size="sm"
              onClick={() => scrollToSection("journey")}
              icon={<Download size={14} />}
              iconPosition="left"
              className="bg-accent text-bg"
            >
              Download CV
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => scrollToSection("journey")}
              icon={<ArrowRight size={14} />}
              className="
                border
                border-accent/50
                text-accent
                hover:bg-accent
                hover:text-bg
              "
            >
              Discover My Journey
            </Button>
          </div>
        </motion.div>

        {/* ================================================================= */}
        {/* RIGHT SIDE                                                         */}
        {/* ================================================================= */}

        <div className="flex flex-col gap-5 lg:gap-6 h-full">
          {/* 2 x 2 stats */}
          <div className="grid grid-cols-2 auto-rows-fr gap-4 lg:gap-5 flex-1">
            {STATS.map((stat, index) => (
              <StatCard
                key={stat.label}
                stat={stat}
                index={index}
              />
            ))}
          </div>

          {/* Current company */}
          {/* <CurrentCompanyCard /> */}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* PHOTO MODAL                                                        */}
      {/* ------------------------------------------------------------------ */}

      <Modal
        isOpen={photoModal.isOpen}
        onClose={photoModal.close}
        title="Profile photo and details"
      >
        <img
          src={profilePhoto}
          alt="Sayantan Chakraborty"
          className="w-full aspect-square object-cover"
        />

        <div className="p-6">
          {detailRows.map((row, i) => (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.15 + i * 0.1,
                duration: 0.4,
              }}
              className="
                flex
                items-start
                gap-3
                py-2.5
                border-b
                border-glass-border
                last:border-b-0
              "
            >
              <span className="text-accent mt-0.5">
                {row.icon}
              </span>

              <div>
                <p
                  className="
                    text-muted
                    text-[10px]
                    font-mono
                    uppercase
                    tracking-widest
                  "
                >
                  {row.label}
                </p>

                <p className="text-primary text-sm font-bold">
                  {row.value}
                </p>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.45,
              duration: 0.4,
            }}
            className="
              grid
              grid-cols-4
              gap-2
              mt-4
              pt-4
              border-t
              border-glass-border
            "
          >
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="text-center"
              >
                <p className="font-header font-black text-accent text-lg">
                  {stat.value}
                </p>

                <p
                  className="
                    text-muted
                    text-[8px]
                    font-mono
                    uppercase
                    tracking-widest
                  "
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </Modal>
    </section>
  );
};