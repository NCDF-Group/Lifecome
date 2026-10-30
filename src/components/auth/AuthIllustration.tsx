import React from "react"
import { cn } from "@/lib/utils"

export type AuthArtwork = "care" | "services" | "email" | "forgot-password" | "reset-password" | "profile" | "interests"

const LINE = { fill: "none", strokeLinecap: "round", strokeLinejoin: "round" } as const

function Arc({ d, color = "#CFE8F8", width = 6, dashed = false }: { d: string; color?: string; width?: number; dashed?: boolean }) {
  return <path d={d} {...LINE} stroke={color} strokeWidth={width} strokeDasharray={dashed ? "14 16" : undefined} />
}

/** The padlock and key leaves share this green-to-blue wash. */
function LeafGradients() {
  return (
    <defs>
      <linearGradient id="auth-leaf" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#A9E6C9" />
        <stop offset="1" stopColor="#6FB4F2" />
      </linearGradient>
      <linearGradient id="auth-dot" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#A5E5C6" />
        <stop offset="1" stopColor="#62ABF2" />
      </linearGradient>
    </defs>
  )
}

/** Login: a heart behind a shield. */
function CareArt() {
  return (
    <>
      <circle cx="395" cy="585" r="178" fill="#E1F5FC" opacity="0.75" />
      <Arc d="M530 492C622 516 694 604 675 710" />
      <Arc d="M205 705C226 800 345 886 457 855" />
      <circle cx="616" cy="438" r="61" fill="#B1EAC9" />
      <circle cx="672" cy="787" r="52" fill="#CDE9FE" />
      <path d="M20 607C92 600 166 652 153 747C80 756 14 700 20 607Z" fill="#CBF2DD" />
      <path d="M207 776C136 770 88 826 95 896C170 900 216 850 207 776Z" fill="#C2EEEF" />
      <path
        d="M378 704 321 749C316 754 309 754 304 749C238 695 140 622 140 546C140 496 180 459 230 459C266 459 296 480 314 517C332 480 362 456 398 456C448 456 490 496 490 548C490 562 487 575 479 587"
        {...LINE}
        stroke="#6AA9F4"
        strokeWidth="9"
      />
      <path d="M513 598 612 635V720C612 775 572 815 512 845Z" fill="#D6E9FB" />
      <path d="M513 598 408 635V720C408 775 452 815 512 845Z" fill="#EFF7FE" />
      <path d="M513 598 612 635V720C612 775 572 815 512 845C452 815 408 775 408 720V635Z" {...LINE} stroke="#2A86F7" strokeWidth="10" />
    </>
  )
}

/** Register: the service cards are real text in the page, so only the heart below them is drawn. */
function ServicesArt() {
  return (
    <>
      <Arc d="M370 982C450 996 500 1060 487 1136" color="#CFE8F8" width={5} />
      <Arc d="M270 1118C282 1140 296 1152 312 1158" color="#CFE8F8" width={5} />
      <circle cx="480" cy="998" r="32" fill="#B1EAC9" />
      <circle cx="428" cy="1112" r="31" fill="#C7E3FC" />
      <path d="M136 1029C186 1020 220 1056 214 1094C166 1098 136 1070 136 1029Z" fill="#BFF0D5" />
      <path d="M241 1104C196 1100 170 1132 176 1166H238C244 1146 246 1124 241 1104Z" fill="#C2EEEF" />
      <path d="M579 1062C536 1056 506 1086 508 1120C550 1132 582 1104 579 1062Z" fill="#C7E3FC" />
      <path
        d="M324 1024C308 1000 276 990 256 1000C240 1008 234 1030 238 1050C246 1084 292 1112 331 1137C372 1112 402 1084 406 1044C408 1020 394 998 370 997C350 996 334 1008 324 1024Z"
        {...LINE}
        stroke="#4E97E4"
        strokeWidth="6"
      />
    </>
  )
}

const SERVICES: { title: string; lines: [string, string]; tone: "green" | "blue"; icon: React.ReactNode }[] = [
  {
    title: "GP services",
    lines: ["Appointments online", "and in person."],
    tone: "green",
    icon: (
      <g {...LINE} stroke="#2E7D32" strokeWidth="2">
        <rect x="3" y="4" width="18" height="13" rx="1.5" />
        <path d="M12 17V20.5M8 20.5H16" />
      </g>
    ),
  },
  {
    title: "Wellbeing",
    lines: ["Support for your", "everyday health."],
    tone: "blue",
    icon: <path d="M20.5 3.5C12 4 6 7.5 6 13C6 15.2 6.9 17 8.4 18C14.4 18.6 19.8 13 20.5 3.5ZM4 21 13 10" {...LINE} stroke="#1E6FD9" strokeWidth="2" />,
  },
  {
    title: "Professional Care",
    lines: ["Support around", "your everyday needs."],
    tone: "blue",
    icon: (
      <g fill="#137BF6">
        <circle cx="12" cy="6.5" r="3" />
        <circle cx="5.5" cy="9.5" r="2.1" />
        <circle cx="18.5" cy="9.5" r="2.1" />
        <rect x="8.4" y="10.5" width="7.2" height="10" rx="3.2" />
        <rect x="2.8" y="12.5" width="4.6" height="8" rx="2.2" />
        <rect x="16.6" y="12.5" width="4.6" height="8" rx="2.2" />
      </g>
    ),
  },
  {
    title: "Insurance",
    lines: ["Explore cover and", "manage policies."],
    tone: "blue",
    icon: <path d="M12 2.8 20 5.5V11.8C20 16.6 16.8 20 12 21.6C7.2 20 4 16.6 4 11.8V5.5Z" {...LINE} stroke="#156CD5" strokeWidth="2" />,
  },
]

/** The four services on the register panel, as real text sitting above its artwork. */
export function ServiceCards() {
  return (
    <ul className="grid grid-cols-2 gap-x-3.5 gap-y-2.5">
      {SERVICES.map(({ title, lines, tone, icon }) => (
        <li key={title} className="rounded-xl border-2 border-white/70 bg-white/25 px-3 pt-1 pb-2">
          <span aria-hidden className={cn("w-[42px] h-[42px] rounded-full flex items-center justify-center", tone === "green" ? "bg-[#D3F4DF]" : "bg-[#D6E9FB]")}>
            <svg viewBox="0 0 24 24" className="w-6 h-6">
              {icon}
            </svg>
          </span>
          <p className="mt-1 text-sm font-semibold text-slate-900 leading-tight">{title}</p>
          <p className="mt-0.5 text-xs text-slate-500 leading-snug">
            {lines[0]}
            <br />
            {lines[1]}
          </p>
        </li>
      ))}
    </ul>
  )
}

/** Verify email: an envelope with a tick badge. */
function EmailArt() {
  return (
    <>
      <circle cx="448" cy="684" r="214" fill="#E2F5FC" />
      <Arc d="M612 578C706 600 776 690 765 812" />
      <Arc d="M280 850C320 950 490 1016 585 945" />
      <circle cx="704" cy="520" r="65" fill="#B1EAC9" />
      <circle cx="764" cy="892" r="56" fill="#CDE9FE" />
      <path d="M70 700C140 690 216 760 210 850C130 860 60 810 70 700Z" fill="#CBF2DD" />
      <path d="M270 880C195 870 140 930 150 1005C225 1015 280 960 270 880Z" fill="#C2EEEF" />
      <rect x="210" y="590" width="400" height="255" rx="32" fill="#E3F4FC" />
      <path d="M490 843H240C222 843 210 831 210 813V620C210 602 222 590 240 590H580C598 590 610 602 610 620V700" {...LINE} stroke="#4E9BF7" strokeWidth="10" />
      <path d="M222 608 382 745C398 759 422 759 438 745L598 608" {...LINE} stroke="#4E9BF7" strokeWidth="10" />
      <path d="M224 830 352 722" {...LINE} stroke="#4E9BF7" strokeWidth="10" />
      <circle cx="604" cy="810" r="106" fill="#F2FBFF" />
      <circle cx="604" cy="810" r="93" fill="#348EFC" />
      <path d="M560 808 592 841 650 782" {...LINE} stroke="#FFFFFF" strokeWidth="14" />
    </>
  )
}

const KEY_OUTLINE =
  "M273 838 170 941C163 948 160 956 160 965V992C160 1006 169 1015 183 1015H203C216 1015 225 1006 225 993V978C225 974 227 972 231 972H247C251 972 253 970 253 966V949C253 945 255 943 259 943H277C281 943 283 941 283 937V920C283 916 285 914 289 914H300C304 914 307 913 309 911L326 893C386 912 442 866 442 806C442 756 402 716 352 716C302 716 262 756 262 806C262 818 266 829 273 838Z"

/** Forgot password: a key resting on an envelope. */
function ForgotPasswordArt() {
  return (
    <>
      <circle cx="300" cy="770" r="168" fill="#D1F5E7" />
      <circle cx="490" cy="830" r="135" fill="#E0F1F8" />
      <circle cx="655" cy="980" r="115" fill="#DBECFC" />
      <Arc d="M458 642C528 614 612 660 626 726" color="#C5DDF3" dashed width={6} />
      <Arc d="M265 1048C310 1102 405 1102 450 1048" color="#C5DDF3" dashed width={6} />
      <rect x="356" y="778" width="304" height="227" rx="32" fill="#EFF8FF" stroke="#1C76F0" strokeWidth="8" />
      <path d="M430 860 486 906C498 916 514 916 526 906L634 814" {...LINE} stroke="#A1C3F1" strokeWidth="10" />
      <path d="M667 736 688 692M699 770 744 746M708 814 748 824" {...LINE} stroke="#2979EC" strokeWidth="12" />
      <path d={KEY_OUTLINE} fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="26" strokeLinejoin="round" />
      <path d={KEY_OUTLINE} fill="#FFFFFF" stroke="#1C76F0" strokeWidth="11" strokeLinejoin="round" />
      <circle cx="365" cy="797" r="22" fill="#F3FAFF" stroke="#1C76F0" strokeWidth="9" />
    </>
  )
}

const LEAF_VEINS = { fill: "none", stroke: "#1879E8", strokeWidth: 5.5, strokeLinecap: "round" } as const

/** Reset password: a padlock and key among leaves. */
function ResetPasswordArt() {
  return (
    <>
      <LeafGradients />
      <ellipse cx="411" cy="636" rx="224" ry="132" transform="rotate(-6 411 636)" fill="#CEF3DC" />
      <circle cx="415" cy="775" r="195" fill="#DBF5E6" />
      <Arc d="M572 590C682 616 772 720 748 842" color="#B7E8D4" />
      <Arc d="M274 966C350 1050 520 1060 592 968" color="#B7E8D4" />
      <path d="M658 598C640 530 688 472 744 474C792 482 792 556 744 590C716 606 680 610 658 598Z" fill="#ACE9C7" />
      <circle cx="735" cy="936" r="68" fill="#C3E4F3" />
      <circle cx="600" cy="492" r="24" fill="url(#auth-dot)" />
      <circle cx="262" cy="1037" r="26" fill="url(#auth-dot)" />
      <circle cx="638" cy="1025" r="21" fill="url(#auth-dot)" />
      <circle cx="99" cy="893" r="26" fill="#54A7F5" />

      <path d="M205 476C247 506 247 570 197 606C160 570 160 510 205 476Z" fill="url(#auth-leaf)" />
      <path d="M204 503 198 602M183 517 202 541M226 520 202 541M181 554 200 574M222 556 200 574" {...LEAF_VEINS} />
      <path d="M120 560C180 568 196 630 167 666C115 660 90 602 120 560Z" fill="url(#auth-leaf)" />
      <path d="M75 708C150 706 216 770 200 862C120 870 64 800 75 708Z" fill="url(#auth-leaf)" />
      <path d="M105 742 198 860M139 744 146 800M97 782 146 800M176 770 170 830M122 820 170 830" {...LEAF_VEINS} />
      <path d="M233 887C150 895 114 960 131 1022C210 1020 246 960 233 887Z" fill="url(#auth-leaf)" />
      <path d="M232 888 155 992M201 930 164 926M201 930 206 968M178 961 145 960M178 961 184 1000" {...LEAF_VEINS} />

      <path d="M325 705V660C325 610 365 570 415 570C465 570 505 610 505 660V705" {...LINE} stroke="#4E9BF4" strokeWidth="12" />
      <path d="M467 958H336C302 958 277 932 277 898V733C277 716 288 705 305 705H518C535 705 546 716 546 733V739" {...LINE} stroke="#4E9BF4" strokeWidth="12" />
      <circle cx="413" cy="815" r="21" fill="#F1FBF6" stroke="#4E9BF4" strokeWidth="12" />
      <path d="M413 842V888" {...LINE} stroke="#4E9BF4" strokeWidth="12" />

      <path
        d="M573 826 492 898C487 903 485 909 485 915V930C485 938 490 943 498 943H527C533 943 538 939 539 933L544 914C545 909 549 906 554 906H574C580 906 585 902 587 896L591 880C593 874 597 870 602 866L612 860A66 66 0 1 0 573 826Z"
        fill="#CCEAF5"
        stroke="#0677F7"
        strokeWidth="11"
        strokeLinejoin="round"
      />
      <circle cx="652" cy="790" r="17" fill="#0677F7" />
    </>
  )
}

/** Onboarding details: a person in a circle. */
function ProfileArt() {
  return (
    <>
      <circle cx="443" cy="766" r="174" fill="#ECFEFF" stroke="#CDEBF5" strokeWidth="4" />
      <Arc d="M507 561C600 580 680 660 674 772" color="#D3ECF9" width={7} />
      <Arc d="M291 906C320 955 370 986 430 996" color="#D3ECF9" width={7} />
      <path d="M118 664C190 640 262 680 250 785C180 800 120 750 118 664Z" fill="#B1EECF" />
      <path d="M252 838C282 900 240 948 190 936C150 925 145 870 180 845C205 828 235 830 252 838Z" fill="#B8ECF9" />
      <path d="M672 590C700 556 760 556 770 612C772 650 720 680 684 658C668 645 662 610 672 590Z" fill="#A4E9CC" />
      <path d="M778 802C730 770 640 800 640 878C700 905 776 880 778 802Z" fill="#C2E4FD" />
      <path d="M622 992C600 1002 560 990 552 960C548 925 590 905 620 925C630 945 630 970 622 992Z" fill="#A9E9D1" />
      <circle cx="444" cy="711" r="54" fill="none" stroke="#1379E7" strokeWidth="9" />
      <path d="M348 866C352 740 535 740 540 866" {...LINE} stroke="#1379E7" strokeWidth="9" />
    </>
  )
}

/** Onboarding interests: a heart among leaves. */
function InterestsArt() {
  return (
    <>
      <Arc d="M486 566C592 580 702 692 686 838" color="#D4E9EE" width={5} />
      <Arc d="M302 822C335 880 390 915 458 918" color="#D4E9EE" width={5} />
      <circle cx="665" cy="573" r="56" fill="#B6EDD8" />
      <circle cx="589" cy="800" r="61" fill="#B3DFFC" />
      <path d="M77 665C142 650 206 700 208 772C140 785 85 740 77 665Z" fill="#BBF2D2" />
      <path d="M252 795C195 790 140 840 150 916C215 920 260 870 252 795Z" fill="#B5EEF5" />
      <path d="M822 658C760 650 714 710 716 780C780 790 830 730 822 658Z" fill="#BAE2FB" />
      <path
        d="M400 648C372 605 322 594 285 605C250 616 238 660 245 695C256 745 340 800 407 850C475 800 540 745 548 682C554 630 522 598 476 597C445 598 420 620 400 648Z"
        {...LINE}
        stroke="#128BDC"
        strokeWidth="8"
      />
    </>
  )
}

// Each scene is drawn in the coordinates of the artwork it replaces, so it keeps its place in the panel
const SCENES: Record<AuthArtwork, { viewBox: string; art: React.ComponentType; align?: "top" }> = {
  care: { viewBox: "0 0 746 1156", art: CareArt, align: "top" },
  services: { viewBox: "0 0 746 1156", art: ServicesArt },
  email: { viewBox: "7 0 882 1178", art: EmailArt },
  "forgot-password": { viewBox: "0 43 880 1105", art: ForgotPasswordArt },
  "reset-password": { viewBox: "37 0 823 1187", art: ResetPasswordArt },
  profile: { viewBox: "70 0 757 1192", art: ProfileArt, align: "top" },
  interests: { viewBox: "72 0 752 1168", art: InterestsArt },
}

export function AuthIllustration({ artwork }: { artwork: AuthArtwork }) {
  const { viewBox, art: Art, align } = SCENES[artwork]
  return (
    <svg aria-hidden viewBox={viewBox} preserveAspectRatio={align === "top" ? "xMidYMin meet" : "xMidYMax meet"} className="absolute inset-0 w-full h-full pointer-events-none">
      <Art />
    </svg>
  )
}
