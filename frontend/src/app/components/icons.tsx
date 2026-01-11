type IconProps = React.SVGProps<SVGSVGElement>;

export const LogoIcon = ({ className = "w-8 h-8", ...props }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Dagbok Cloud Logo"
    {...props}
  >
    <path
      d="M19.6893 0C24.2213 0 27.9423 3.39052 28.3329 7.71387H25.8573C25.477 4.73051 22.8672 2.41016 19.6893 2.41016C16.7903 2.41037 14.3646 4.34153 13.6727 6.94531C13.6645 6.94063 13.6566 6.93532 13.6483 6.93066C12.9557 6.53715 12.2012 6.22898 11.3856 6.00781C12.4654 2.53124 15.774 0.000208396 19.6893 0Z"
      fill="white"
    />
    <path
      d="M25.8462 5.3032C29.2448 5.3032 32 8.0013 32 11.3296C32 14.6578 29.2448 17.3559 25.8462 17.3559V14.9454C27.8854 14.9454 29.5385 13.3265 29.5385 11.3296C29.5385 9.3326 27.8854 7.71375 25.8462 7.71375V5.3032Z"
      fill="white"
    />
    <path
      d="M17.9912 10.3655H15.2168V8.37626H11.0996C9.20497 8.37626 7.63436 8.73462 6.38867 9.45048C5.1431 10.1663 4.21417 11.1851 3.60254 12.5071C2.9909 13.8292 2.68556 15.4037 2.68555 17.2298C2.68555 19.0413 2.9876 20.6009 3.5918 21.9085C4.19595 23.2232 5.09803 24.2317 6.29883 24.9329C7.49976 25.6415 8.99592 25.9954 10.7861 25.9954H15.2168V14.4632H17.9912V28.4065H10.6074C8.38458 28.4065 6.48174 27.9564 4.90039 27.0579C3.31925 26.1667 2.10746 24.8848 1.26465 23.2122C0.421787 21.5467 0 19.5526 0 17.2298C1.86467e-05 14.8924 0.425094 12.88 1.27539 11.1927C2.12574 9.51259 3.36413 8.21954 4.99023 7.31376C6.61625 6.41534 8.59282 5.96615 10.9199 5.9661H17.9912V10.3655ZM17.9912 13.4993H15.2168V11.2688H17.9912V13.4993Z"
      fill="#FF7518"
    />
    <path
      d="M18.6471 11.2697C21.1311 11.2697 22.9941 11.6914 24.2361 12.535C25.478 13.3687 26.099 14.6242 26.099 16.3014C26.099 17.5275 25.7485 18.5574 25.0474 19.3911C24.3462 20.2248 23.3546 20.7839 22.0726 21.0684C23.7553 21.2646 25.0524 21.8187 25.9638 22.7309C26.8753 23.6333 27.331 24.776 27.331 26.159C27.331 28.003 26.6449 29.44 25.2727 30.4699C23.9005 31.49 21.9925 32 19.5486 32H10.9548V29.2881H13.8244V29.7489H19.3983C21.1511 29.7489 22.4282 29.4302 23.2294 28.7926C24.0307 28.1551 24.4314 27.2036 24.4314 25.9383C24.4314 23.496 22.6786 22.2748 19.173 22.2748H17.9692V20.0826H18.6471C20.1796 20.0826 21.3214 19.8031 22.0726 19.244C22.8338 18.6751 23.2144 17.807 23.2144 16.6398C23.2144 15.5217 22.8238 14.7223 22.0425 14.2416C21.2613 13.761 20.1295 13.5207 18.6471 13.5207H13.8244V20.0826H13.8461V22.2748H13.8244V25.1299H10.9548V11.2697H18.6471ZM13.8244 28.3842H10.9548V26.0339H13.8244V28.3842Z"
      fill="#FF7518"
    />
  </svg>
);

export const CalendarIcon = ({
  className = "w-6 h-6",
  ...props
}: IconProps) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label="Calendar"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

export const ProfileIcon = ({ className = "w-6 h-6", ...props }: IconProps) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    role="img"
    aria-label="Profile"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

export const SettingsIcon = ({
  className = "w-6 h-6",
  ...props
}: IconProps) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label="Settings"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

export const AdminIcon = ({ className = "w-6 h-6", ...props }: IconProps) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label="Admin"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
);

export const HomeIcon = ({ className = "w-6 h-6", ...props }: IconProps) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

export const LoginIcon = ({ className = "w-6 h-6", ...props }: IconProps) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label="Login"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
    />
  </svg>
);

export const SearchIcon = ({ className = "w-6 h-6", ...props }: IconProps) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Search"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

export const AIRobotHeadIcon = ({
  className = "w-6 h-6",
  ...props
}: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="AI Assistant"
    {...props}
  >
    {/* Head */}
    <rect
      x="6"
      y="6"
      width="12"
      height="12"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />

    {/* AI Text */}
    <text
      x="12"
      y="14.5"
      textAnchor="middle"
      fontSize="8"
      fontWeight="bold"
      fill="currentColor"
    >
      AI
    </text>
  </svg>
);

export const EditIcon = ({ className = "w-6 h-6", ...props }: IconProps) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

export const CheckIcon = ({ className = "w-6 h-6", ...props }: IconProps) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

export const XIcon = ({ className = "w-6 h-6", ...props }: IconProps) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

export const AppleIconOrange = ({ className, ...props }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    {...props}
  >
    <g>
      <rect width="48" height="48" fill="none" />
      <rect width="48" height="48" fill="none" />
      <path d="M20,15.7c-4.5,0-7.5,3.7-7.5,9.3s2.8,9.4,7.2,9.4S27,29.6,27,24.9,25.2,15.7,20,15.7Zm0,0c-4.5,0-7.5,3.7-7.5,9.3s2.8,9.4,7.2,9.4S27,29.6,27,24.9,25.2,15.7,20,15.7ZM42,4H6A2,2,0,0,0,4,6V42a2,2,0,0,0,2,2H42a2,2,0,0,0,2-2V6A2,2,0,0,0,42,4ZM8.9,35.7H7.3V20.2H8.9ZM8,17.3a1.1,1.1,0,0,1-1-1.1,1.1,1.1,0,1,1,2.2,0A1.1,1.1,0,0,1,8,17.3ZM19.7,36c-4.4,0-8.8-3.4-8.8-10.9S15.5,14,20,14a7.7,7.7,0,0,1,3.4.7,8.3,8.3,0,0,1,2.8,2.1,12.5,12.5,0,0,1,2.5,8C28.7,33.1,23.8,36,19.7,36Zm14.8,0a8.4,8.4,0,0,1-4.7-1.4l-.3-.2.7-1.5.4.3a8.2,8.2,0,0,0,4,1.2c2.3,0,4.8-1.6,4.8-4.3s-1.2-3.6-4.2-4.9-5.1-2.4-5.1-5.6,2.5-5.6,6-5.6a7.2,7.2,0,0,1,4,1l.3.3-.7,1.4-.5-.3a6.2,6.2,0,0,0-3.1-.8,4.1,4.1,0,0,0-4.3,4c0,2.2,1.6,3,4,4.1h.3c3.2,1.6,4.9,3,4.9,6.1S38.3,36,34.5,36ZM20,15.7c-4.5,0-7.5,3.7-7.5,9.3s2.8,9.4,7.2,9.4S27,29.6,27,24.9,25.2,15.7,20,15.7Z" />
    </g>
  </svg>
);

export const AndroidIcon = ({ className, ...props }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M15.3226823,3.38442452 C16.8998719,4.08395665 18,5.66350398 18,7.5 L18,8 L18.5,8 C19.3284271,8 20,8.67157288 20,9.5 L20,14.5 C20,15.3284271 19.3284271,16 18.5,16 L18,16 L18,17.5 C18,17.7761424 17.7761424,18 17.5,18 L16,18 L16,20.5 C16,21.3284271 15.3284271,22 14.5,22 C13.6715729,22 13,21.3284271 13,20.5 L13,18 L11,18 L11,20.5 C11,21.3284271 10.3284271,22 9.5,22 C8.67157288,22 8,21.3284271 8,20.5 L8,18 L6.5,18 C6.22385763,18 6,17.7761424 6,17.5 L6,16 L5.5,16 C4.67157288,16 4,15.3284271 4,14.5 L4,9.5 C4,8.67157288 4.67157288,8 5.5,8 L6,8 L6,7.5 C6,5.66350398 7.10012809,4.08395665 8.67731774,3.38442452 L8.14644661,2.85355339 C7.95118446,2.65829124 7.95118446,2.34170876 8.14644661,2.14644661 C8.34170876,1.95118446 8.65829124,1.95118446 8.85355339,2.14644661 L9.7665765,3.05946972 C10.0052544,3.02034558 10.2502512,3 10.5,3 L13.5,3 C13.7497488,3 13.9947456,3.02034558 14.2334235,3.05946972 L15.1464466,2.14644661 C15.3417088,1.95118446 15.6582912,1.95118446 15.8535534,2.14644661 C16.0488155,2.34170876 16.0488155,2.65829124 15.8535534,2.85355339 L15.3226823,3.38442452 Z M14,18 L14,20.5 C14,20.7761424 14.2238576,21 14.5,21 C14.7761424,21 15,20.7761424 15,20.5 L15,18 L14,18 Z M10,18 L9,18 L9,20.5 C9,20.7761424 9.22385763,21 9.5,21 C9.77614237,21 10,20.7761424 10,20.5 L10,18 Z M6,9 L5.5,9 C5.22385763,9 5,9.22385763 5,9.5 L5,14.5 C5,14.7761424 5.22385763,15 5.5,15 L6,15 L6,9 Z M18,9 L18,15 L18.5,15 C18.7761424,15 19,14.7761424 19,14.5 L19,9.5 C19,9.22385763 18.7761424,9 18.5,9 L18,9 Z M7.03544443,7 L16.9645556,7 C16.7219407,5.30385293 15.263236,4 13.5,4 L10.5,4 C8.73676405,4 7.27805926,5.30385293 7.03544443,7 Z M9,5 L10,5 L10,6 L9,6 L9,5 Z M14,5 L15,5 L15,6 L14,6 L14,5 Z M7,8 L7,17 L17,17 L17,8 L7,8 Z" />
  </svg>
);
