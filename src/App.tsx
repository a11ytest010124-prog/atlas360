import { useState, useEffect, useRef, useId } from "react"
import * as React from "react"
import { Bell, Settings, ChevronDown } from "lucide-react"
import atlasLogo from "@/imports/New_Project__1_.png"
import RunStatusModal from "./RunStatusModal"
import { WorkflowTestForm } from "./WorkflowTestForm"
type IconProps = {
  className?: string
}

const navigation = [
  { label: "Request Center", icon: InboxIcon },
  { label: "Store Lookup", icon: StoreIcon },
  { label: "Automation Tests", icon: BeakerIcon },
  { label: "Environment Insights", icon: GrafanaIcon },
]

const projects = [
  {
    id: "fulfillment",
    name: "Fulfillment",
    type: "primary",
    lastRun: "May 26, 2025 · 10:42 AM",
  },
  {
    id: "e2e-qe-eng-ops",
    name: "E2E QE Eng Ops",
    type: "sub-project",
    parentId: "fulfillment",
    lastRun: "",
  },
  {
    id: "accupick-web",
    name: "AcuPick Web",
    type: "sub-project",
    parentId: "fulfillment",
    lastRun: "",
  },
  {
    id: "accupick-app",
    name: "AcuPick App",
    type: "sub-project",
    parentId: "fulfillment",
    lastRun: "",
  },
  {
    id: "doms",
    name: "DOMS",
    type: "sub-project",
    parentId: "fulfillment",
    lastRun: "May 25, 2025 · 4:35 PM",
  },
  {
    id: "dcp",
    name: "DCP",
    type: "sub-project",
    parentId: "fulfillment",
    lastRun: "May 25, 2025 · 2:12 PM",
  },
  {
    id: "enterprise-item",
    name: "Enterprise Item",
    type: "primary",
    lastRun: "May 26, 2025 · 11:06 AM",
  },
  {
    id: "mevend",
    name: "MEVEND",
    type: "sub-project",
    parentId: "enterprise-item",
    lastRun: "May 24, 2025 · 3:49 PM",
  },
  {
    id: "meitem",
    name: "MEITEM",
    type: "sub-project",
    parentId: "enterprise-item",
    lastRun: "May 24, 2025 · 1:21 PM",
  },
]

type AutomationProject = typeof projects[number]

const AUTOMATION_PROJECTS_KEY = "atlas360-automation-projects"
const AUTOMATION_PROJECTS_EVENT = "atlas360-automation-projects-updated"

function readAutomationProjects(): AutomationProject[] {
  try {
    const stored = window.localStorage.getItem(AUTOMATION_PROJECTS_KEY)

    if (!stored) return [...projects]

    const parsed = JSON.parse(stored)

    return Array.isArray(parsed) ? parsed : [...projects]
  } catch {
    return [...projects]
  }
}

function saveAutomationProjects(updated: AutomationProject[]) {
  window.localStorage.setItem(AUTOMATION_PROJECTS_KEY, JSON.stringify(updated))

  window.dispatchEvent(new Event(AUTOMATION_PROJECTS_EVENT))
}

function useAutomationProjects() {
  const [automationProjects, setAutomationProjects] =
    useState<AutomationProject[]>(readAutomationProjects)

  useEffect(() => {
    const refresh = () => {
      setAutomationProjects(readAutomationProjects())
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === AUTOMATION_PROJECTS_KEY) refresh()
    }

    window.addEventListener(AUTOMATION_PROJECTS_EVENT, refresh)
    window.addEventListener("storage", handleStorage)

    return () => {
      window.removeEventListener(AUTOMATION_PROJECTS_EVENT, refresh)
      window.removeEventListener("storage", handleStorage)
    }
  }, [])

  return automationProjects
}

type AtlasNotification = {
  id: number
  title: string
  message: string
  time: string
  type: "success" | "warning" | "error" | "info"
  read: boolean
}

function ProfileContentPage({
  title,
  onBack,
}: {
  title: string
  onBack: () => void
}) {
  return (
    <div className="pb-10">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 rounded-md px-1 py-1 text-[13px] font-semibold text-[#00539B] transition hover:text-[#003B70] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00539B]"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m15 18-6-6 6-6" />
          <path d="M20 12H9" />
        </svg>
        Back to{" "}
        {title === "Onboarding" || title === "Contact Us" ? "ATLAS360" : "Home"}
      </button>

      <section className="rounded-xl border border-[#DDE3E9] bg-white px-6 py-6 shadow-sm">
        <h1 className="text-[28px] font-bold text-[#13203D] sm:text-[34px]">
          {title}
        </h1>
      </section>
    </div>
  )
}

function NotificationDrawer({
  notifications,
  onClose,
  onMarkRead,
  onMarkAllRead,
}: {
  notifications: AtlasNotification[]
  onClose: () => void
  onMarkRead: (id: number) => void
  onMarkAllRead: () => void
}) {
  const unreadCount = notifications.filter((n) => !n.read).length

  const colors = {
    success: "bg-[#E8F7EE] text-[#16765B]",
    warning: "bg-[#FFF5E3] text-[#926412]",
    error: "bg-[#FCEBED] text-[#C04755]",
    info: "bg-[#E8F0F7] text-[#003B70]",
  }

  const icons = {
    success: "✓",
    warning: "!",
    error: "×",
    info: "i",
  }

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[200]">
      <div
        className="absolute inset-0 bg-[#0B223D]/35"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="notifications-title"
        className="absolute inset-y-0 right-0 flex w-full max-w-[430px] flex-col bg-white shadow-2xl"
        style={{ animation: "atlasSlideIn 250ms ease-out" }}
      >
        <div className="flex items-center justify-between bg-[#003B70] px-6 py-5">
          <div className="flex items-center gap-3">
            <h2
              id="notifications-title"
              className="text-[19px] font-bold text-white"
            >
              Notifications
            </h2>

            {unreadCount > 0 && (
              <span className="rounded-full bg-[#E8F0F7] px-2.5 py-1 text-[10px] font-bold text-[#003B70]">
                {unreadCount} new
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close notifications"
            className="atlas-dialog-close atlas-dialog-close--light"
          >
            ×
          </button>
        </div>

        <div className="flex items-center justify-between border-b border-[#E9EDF1] px-6 py-4">
          <span className="text-[12px] font-semibold text-[#526174]">
            Recent activity
          </span>

          <button
            type="button"
            onClick={onMarkAllRead}
            disabled={unreadCount === 0}
            className="text-[12px] font-semibold text-[#00539B] hover:underline disabled:opacity-40"
          >
            Mark all as read
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <p className="text-[15px] font-bold text-[#17233D]">
                You're all caught up
              </p>
              <p className="mt-2 text-[12px] text-[#8791A0]">
                New updates will appear here.
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => onMarkRead(notification.id)}
                className={`flex w-full items-start gap-3 border-b border-[#EEF1F4] px-6 py-5 text-left transition-colors hover:bg-[#F4F7FA] ${
                  notification.read ? "bg-white" : "bg-[#F3F7FB]"
                }`}
              >
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-lg text-[17px] font-bold ${
                    colors[notification.type]
                  }`}
                >
                  {icons[notification.type]}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-2">
                    <span className="text-[13px] font-bold text-[#17233D]">
                      {notification.title}
                    </span>

                    {!notification.read && (
                      <span className="mt-1.5 size-2 shrink-0 rounded-full bg-[#00539B]" />
                    )}
                  </span>

                  <span className="mt-1 block text-[12px] leading-5 text-[#687386]">
                    {notification.message}
                  </span>

                  <span className="mt-2 block text-[11px] text-[#98A2B3]">
                    {notification.time}
                  </span>
                </span>
              </button>
            ))
          )}
        </div>

        <div className="border-t border-[#E9EDF1] px-6 py-4 text-center">
          <p className="text-[11px] text-[#98A2B3]">
            ATLAS360 • Notification Center
          </p>
        </div>
      </aside>

      <style>{`
        @keyframes atlasSlideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          aside[aria-labelledby="notifications-title"] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}

type AdminNotification = {
  id: string
  title: string
  message: string
  requestNumber: string
  requestType: string
  createdAt: string
  read: boolean
}

const ADMIN_NOTIFICATIONS_KEY = "atlas360-admin-notifications"
const ADMIN_NOTIFICATIONS_EVENT = "atlas360-admin-notifications-updated"

function createAdminNotification(
  requestNumber: string,
  requestType: string,
  status: string,
) {
  const readableType: Record<string, string> = {
    "Add Project": "Project Onboarding",
    "Other Requests": "Other Request",
    "Request Access": "Access Request",
    "Revoke Access": "Access Revocation Request",
  }

  const title = readableType[requestType] || requestType

  const statusMessage: Record<string, string> = {
    "In Progress": "has been accepted and is now in progress.",
    "Need More Details": "requires additional information.",
    Completed: "has been completed.",
    Rejected: "has been rejected.",
    Submitted: "has been submitted.",
  }

  const notification: AdminNotification = {
    id: crypto.randomUUID(),
    title,
    message: `${requestNumber} ${statusMessage[status] || `was updated to ${status}.`}`,
    requestNumber,
    requestType,
    createdAt: new Date().toISOString(),
    read: false,
  }

  try {
    const existing: AdminNotification[] = JSON.parse(
      window.localStorage.getItem(ADMIN_NOTIFICATIONS_KEY) || "[]",
    )

    window.localStorage.setItem(
      ADMIN_NOTIFICATIONS_KEY,
      JSON.stringify([notification, ...existing].slice(0, 100)),
    )

    window.dispatchEvent(new Event(ADMIN_NOTIFICATIONS_EVENT))
  } catch (error) {
    console.error("Unable to save admin notification", error)
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState("Request Center")
  const [onboardingInitialAction, setOnboardingInitialAction] =
    useState<"add" | "request" | "revoke" | "other">("add")
  const [profileOpen, setProfileOpen] = useState(false)
  const [showServiceList, setShowServiceList] = useState(false)

  const [profilePage, setProfilePage] =
    useState<"onboarding" | "contact" | "requestHistory" | "admin-operations" | "settings" | "user-access" | null>(
      null,
    )

  const [requestHistoryInitialTab, setRequestHistoryInitialTab] =
    useState<"requestCenter" | "automation" | "onboarding">("requestCenter")

  // Temporary permission state for Figma Make testing
  const [hasAutomationAccess, setHasAutomationAccess] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)
  const [adminNotifications, setAdminNotifications] =
    useState<AdminNotification[]>(() => {
      try {
        return JSON.parse(
          window.localStorage.getItem(ADMIN_NOTIFICATIONS_KEY) || "[]",
        )
      } catch {
        return []
      }
    })
  const [notifications, setNotifications] = useState<AtlasNotification[]>([
    {
      id: 1,
      title: "Automation completed",
      message: "Fulfillment regression completed successfully.",
      time: "5 min ago",
      type: "success",
      read: false,
    },
    {
      id: 2,
      title: "Access request pending",
      message: "REQ-1043 is awaiting project owner approval.",
      time: "24 min ago",
      type: "warning",
      read: false,
    },
    {
      id: 3,
      title: "API health alert",
      message: "Auth Service (Non-Prod) is reporting errors.",
      time: "1 hour ago",
      type: "error",
      read: false,
    },
    {
      id: 4,
      title: "Project added",
      message: "AcuPick automation project is now available.",
      time: "Yesterday",
      type: "info",
      read: true,
    },
  ])

  const combinedNotifications: AtlasNotification[] = [
    ...adminNotifications.map((notification, index) => ({
      id: -(index + 1),
      title: notification.title,
      message: notification.message,
      time: new Date(notification.createdAt).toLocaleString(),
      type: "info" as const,
      read: notification.read,
    })),
    ...notifications,
  ]

  const unreadNotificationCount = combinedNotifications.filter(
    (notification) => !notification.read,
  ).length

  const markNotificationRead = (id: number) => {
    if (id < 0) {
      const notification = adminNotifications[-id - 1]
      if (!notification) return

      const updated = adminNotifications.map((item) =>
        item.id === notification.id ? { ...item, read: true } : item,
      )

      setAdminNotifications(updated)

      window.localStorage.setItem(
        ADMIN_NOTIFICATIONS_KEY,
        JSON.stringify(updated),
      )

      return
    }

    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    )
  }

  const markAllNotificationsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      })),
    )

    const updated = adminNotifications.map((notification) => ({
      ...notification,
      read: true,
    }))

    setAdminNotifications(updated)

    window.localStorage.setItem(
      ADMIN_NOTIFICATIONS_KEY,
      JSON.stringify(updated),
    )
  }
  useEffect(() => {
    const refreshAdminNotifications = () => {
      try {
        setAdminNotifications(
          JSON.parse(
            window.localStorage.getItem(ADMIN_NOTIFICATIONS_KEY) || "[]",
          ),
        )
      } catch {
        setAdminNotifications([])
      }
    }

    window.addEventListener(
      ADMIN_NOTIFICATIONS_EVENT,
      refreshAdminNotifications,
    )

    window.addEventListener("storage", refreshAdminNotifications)

    return () => {
      window.removeEventListener(
        ADMIN_NOTIFICATIONS_EVENT,
        refreshAdminNotifications,
      )
      window.removeEventListener("storage", refreshAdminNotifications)
    }
  }, [])
  const openOtherRequests = () => {
    setOnboardingInitialAction("other")
    setProfilePage("onboarding")
    setProfileOpen(false)
  }
  return (
    <div className="min-h-screen bg-white">
      {" "}
      <header className="bg-[#003b70] text-white">
        <div className="relative mx-auto grid h-[60px] max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center py-0 pl-5 pr-2.5">
          <a
            href="#main-content"
            className="group justify-self-start rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00a3e0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#003B70]"
            aria-label="ATLAS 360 home"
          >
            <span className="flex h-14 items-center rounded-md bg-white px-2.5 py-1 shadow-sm transition-shadow duration-200 group-hover:shadow-md">
              <img
                src={atlasLogo}
                alt="ATLAS 360 logo"
                className="block h-full w-auto object-contain"
              />
            </span>
          </a>

          <div className="text-center">
            <p className="text-[18px] font-bold leading-tight tracking-[0.1em] text-white">
              ATLAS <span className="font-bold text-[#00a3e0]">360</span>
            </p>
            <p className="mt-0.5 hidden whitespace-nowrap text-[14px] leading-tight text-[#c9d8e8] md:block">
              Automation | Team Lookup | Availability | Store Intelligence
            </p>
          </div>

          <div className="flex items-center justify-self-end gap-x-0 gap-y-3">
            <button
              type="button"
              onClick={() => setShowNotifications(true)}
              className="relative grid size-10 place-items-center rounded-full text-[#c9d2e5] transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00a3e0]"
              aria-label={`Notifications, ${unreadNotificationCount} unread`}
              aria-expanded={showNotifications}
              aria-haspopup="dialog"
            >
              <BellIcon className="size-5" />

              {unreadNotificationCount > 0 && (
                <span className="absolute right-[8px] top-[7px] size-2 rounded-full bg-[#e31837] ring-2 ring-[#003b70]" />
              )}
            </button>

            <div className="mx-1 h-7 w-px bg-white/15 sm:mx-2" />

            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                className="flex items-center gap-1 rounded-full border border-white/30 bg-white/5 py-1 pl-1 pr-2 text-left transition-all duration-200 hover:border-white/60 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00a3e0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#003B70]"
                aria-label="Open user profile"
                aria-expanded={profileOpen}
                aria-haspopup="menu"
              >
                <span className="grid size-9 place-items-center rounded-full bg-[#e5f3fa] text-[12px] font-bold tracking-wide text-[#003b70]">
                  SG
                </span>
                <ChevronDownIcon
                  className={`ml-1 size-[24px] text-[#c9d8e8] transition-transform duration-200 ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {profileOpen && (
                <div
                  className="absolute right-0 top-[calc(100%+10px)] z-50 w-56 overflow-hidden rounded-xl border border-[#d9e1e9] bg-white text-[#16213e] shadow-[0_14px_35px_rgba(0,36,70,0.2)]"
                  role="menu"
                  aria-label="User profile"
                >
                  {/* User information */}
                  <div className="border-b border-[#e8edf2] px-4 py-3.5">
                    <p className="text-[13px] font-bold text-[#17233f]">
                      Shruthi Gopalakrishna
                    </p>
                    <p className="mt-1 text-[11px] text-[#778198]">
                      Product Owner
                    </p>
                  </div>
                  {/* Admin Operations */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setProfilePage("admin-operations")
                      setProfileOpen(false)
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-[12px] font-medium text-[#34415b] transition hover:bg-[#f0f6fc] focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#00539b]"
                  >
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 3 4 7v5c0 5 3.5 8 8 9 4.5-1 8-4 8-9V7l-8-4Z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                    Admin Operations
                  </button>
                  {/* Onboarding */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setOnboardingInitialAction("add")
                      setProfilePage("onboarding")
                      setProfileOpen(false)
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-[12px] font-medium text-[#34415b] transition hover:bg-[#f0f6fc] focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#00539b]"
                  >
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 7v14" />
                      <path d="M3 18V5a2 2 0 0 1 2-2h3a4 4 0 0 1 4 4 4 4 0 0 1 4-4h3a2 2 0 0 1 2 2v13h-5a4 4 0 0 0-4 3 4 4 0 0 0-4-3H3Z" />
                    </svg>
                    Onboarding
                  </button>
                  {/* Request History */}
                  <button
                    type="button"
                    onClick={() => {
                      setRequestHistoryInitialTab("requestCenter")
                      setProfilePage("requestHistory")
                      setProfileOpen(false)
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[13px] text-[#17233D] hover:bg-[#F4F6F8]"
                  >
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M3 12a9 9 0 1 0 3-6.7" />
                      <path d="M3 3v6h6" />
                      <path d="M12 7v5l3 2" />
                    </svg>
                    Request History
                  </button>
                  {/* Settings */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setProfilePage("settings")
                      setProfileOpen(false)
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-[12px] font-medium text-[#34415B] transition hover:bg-[#F0F6FC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#00539B]"
                  >
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
                      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.9 1.9-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.05 1.57V21h-2.7v-.99a1.7 1.7 0 0 0-1.05-1.57 1.7 1.7 0 0 0-1.88.34l-.06.06-1.9-1.9.06-.06A1.7 1.7 0 0 0 7.72 15a1.7 1.7 0 0 0-1.57-1.05H5.2v-2.7h.95A1.7 1.7 0 0 0 7.72 10a1.7 1.7 0 0 0-.34-1.88l-.06-.06 1.9-1.9.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 12.21 5V4h2.7v1a1.7 1.7 0 0 0 1.05 1.57 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.9 1.9-.06.06A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.57 1.05h.95v2.7h-.95A1.7 1.7 0 0 0 19.4 15Z" />
                    </svg>
                    Settings
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setProfilePage("user-access")
                      setProfileOpen(false)
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-[12px] font-medium text-[#34415B] transition hover:bg-[#F0F6FC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#00539B]"
                  >
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="9" cy="8" r="3" />
                      <path d="M3 20v-2a6 6 0 0 1 12 0v2M17 8h5M19.5 5.5v5" />
                    </svg>
                    User Access
                  </button>

                  {/* Contact Us */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setProfilePage("contact")
                      setProfileOpen(false)
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-[12px] font-medium text-[#34415b] transition hover:bg-[#f0f6fc] focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#00539b]"
                  >
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m3 7 9 6 9-6" />
                    </svg>
                    Contact Us
                  </button>

                  {/* Logout */}
                  <div className="border-t border-[#e8edf2]">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setProfileOpen(false)
                        // Connect to your SSO logout flow here.
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-[12px] font-semibold text-[#B42318] transition hover:bg-[#FFF4F2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#B42318]"
                    >
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <path d="m16 17 5-5-5-5" />
                        <path d="M21 12H9" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {profilePage === null && (
          <nav
            className="border-t border-t-[#003B70]/10 border-b-[6px] border-b-[#003B70] bg-[#E8F0F7]"
            aria-label="Primary navigation"
          >
            <div className="no-scrollbar mx-auto max-w-[1440px] overflow-x-auto px-5 sm:px-8 lg:px-12">
              <div className="relative flex w-max min-w-full pt-1">
                {navigation.map(({ label, icon: Icon }, index) => {
                  const isActive = activeTab === label
                  const prevIsActive =
                    navigation[index - 1]?.label === activeTab
                  const nextIsActive =
                    navigation[index + 1]?.label === activeTab

                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => {
                        setActiveTab(label)
                        setProfilePage(null)
                        setProfileOpen(false)
                      }}
                      aria-current={isActive ? "page" : undefined}
                      className={`
              group relative flex min-w-[165px] flex-1
              shrink-0 items-center justify-center
              gap-2.5 border-0
              px-6 pt-3 pb-3
              text-[13px] font-semibold
              transition-colors duration-200
              focus-visible:z-30
              focus-visible:outline
              focus-visible:outline-2
              focus-visible:outline-[#003B70]

              rounded-t-[24px]

              before:pointer-events-none
              before:absolute
              before:-left-7
              before:bottom-0
              before:size-7
              before:content-['']

              after:pointer-events-none
              after:absolute
              after:-right-7
              after:bottom-0
              after:size-7
              after:content-['']

              ${
                isActive
                  ? `
                    z-20
                    bg-[#003B70] text-white

                    before:bg-[radial-gradient(circle_at_0_0,transparent_28px,#003B70_28.5px)]
                    after:bg-[radial-gradient(circle_at_100%_0,transparent_28px,#003B70_28.5px)]
                  `
                  : `
                    z-10
                    bg-transparent text-[#003B70]

                    hover:z-[15]
                    hover:bg-[#D6E4F1]

                    ${
                      prevIsActive
                        ? ""
                        : "hover:before:bg-[radial-gradient(circle_at_0_0,transparent_28px,#D6E4F1_28.5px)]"
                    }
                    ${
                      nextIsActive
                        ? ""
                        : "hover:after:bg-[radial-gradient(circle_at_100%_0,transparent_28px,#D6E4F1_28.5px)]"
                    }
                  `
              }
            `}
                    >
                      <Icon className="size-[18px]" aria-hidden="true" />
                      <span>{label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </nav>
        )}
      </header>
      <div className="w-full bg-white px-5 pb-5 sm:px-10 sm:pb-10 lg:px-16 lg:pb-16">
        <main
          id="main-content"
          className="relative isolate mx-auto w-full max-w-[1300px] px-4 sm:px-6 md:px-8 lg:px-[5%] xl:px-[7%] 2xl:px-[9%] py-8 before:absolute before:inset-y-0 before:inset-x-4 sm:before:inset-x-6 lg:before:inset-x-14 before:-z-10 before:rounded-b-xl before:bg-[#F4F6F8]"
        >
          {profilePage === "admin-operations" ? (
            <AdminOperationsPage onBack={() => setProfilePage(null)} />
          ) : profilePage === "settings" ? (
            <SettingsPage onBack={() => setProfilePage(null)} />
          ) : profilePage === "user-access" ? (
            <UserAccessPage
              onBack={() => setProfilePage(null)}
              projectOptions={projects
                .filter((project) => project.type === "primary")
                .map((project) => ({
                  id: project.id,
                  name: project.name,
                }))}
            />
          ) : profilePage === "onboarding" ? (
            <OnboardingPage
              onBack={() => setProfilePage(null)}
              initialAction={onboardingInitialAction}
              onOpenRequestHistory={() => {
                setRequestHistoryInitialTab("onboarding")
                setProfilePage("requestHistory")
              }}
            />
          ) : profilePage === "requestHistory" ? (
            <RequestHistoryPage
              onBack={() => setProfilePage(null)}
              initialTab={requestHistoryInitialTab}
            />
          ) : profilePage === "contact" ? (
            <ContactUsPage onBack={() => setProfilePage(null)} />
          ) : (
            <>
              {activeTab === "Request Center" && (
                <RequestCenterSection2
                  onOpenOnboarding={() => {
                    setOnboardingInitialAction("add")
                    setProfilePage("onboarding")
                  }}
                  onOpenOtherRequests={openOtherRequests}
                  onOpenRequestHistory={() => setProfilePage("requestHistory")}
                />
              )}
              {activeTab === "Store Lookup" && <StoreLookupSection />}

              {activeTab === "Automation Tests" &&
                (hasAutomationAccess ? (
                  <AutomationTests />
                ) : (
                  <AutomationTestsNoAccess
                    onRequestAccess={() => {
                      setProfilePage(null)
                      setActiveTab("Request Center")
                    }}
                  />
                ))}

              {activeTab === "Environment Insights" &&
                (showServiceList ? (
                  <ServiceListPage onBack={() => setShowServiceList(false)} />
                ) : (
                  <GrafanaDashboardsSection
                    onOpenServiceList={() => setShowServiceList(true)}
                  />
                ))}

              {/* Temporarily hidden — future release */}
              {/* {activeTab === "API Health" && <ApiHealthSection />} */}
            </>
          )}
        </main>
      </div>
      {showNotifications && (
        <NotificationDrawer
          notifications={combinedNotifications}
          onClose={() => setShowNotifications(false)}
          onMarkRead={markNotificationRead}
          onMarkAllRead={markAllNotificationsRead}
        />
      )}
    </div>
  )
}
const EMPTY_PRIORITY_RESULTS: PriorityReportData = {
  P0: { pass: 0, fail: 0, notExecuted: 10 },
  P1: { pass: 0, fail: 0, notExecuted: 10 },
  P2: { pass: 0, fail: 0, notExecuted: 10 },
}
function AutomationTestsNoAccess({
  onRequestAccess,
}: {
  onRequestAccess: () => void
}) {
  return (
    <div className="pb-10">
      <div>
        <h1 className="text-[28px] font-bold text-[#13203D] sm:text-[34px]">
          Automation overview
        </h1>

        <p className="mt-2 text-[12px] text-[#69748B]">
          Run and manage automated test executions across projects.
        </p>
      </div>

      <section className="mt-8 flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-[#DDE3E9] bg-white px-6 py-12 text-center shadow-sm">
        <div className="flex size-16 items-center justify-center rounded-full bg-[#E8F0F7]">
          <svg
            className="size-8 text-[#003B70]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="5" y="10" width="14" height="11" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            <path d="M12 14v3" />
          </svg>
        </div>

        <h2 className="mt-6 text-[21px] font-bold text-[#17233D]">
          Automation Access Required
        </h2>

        <p className="mt-3 max-w-[460px] text-[13px] leading-6 text-[#687386]">
          You currently don't have permission to access automation projects.
          Request access to execute test suites and view automation reports.
        </p>

        <button
          type="button"
          onClick={onRequestAccess}
          className="mt-7 rounded-lg bg-[#003B70] px-6 py-3 text-[13px] font-semibold text-white transition hover:bg-[#00539B]"
        >
          Request Access
        </button>

        <p className="mt-4 text-[11px] text-[#98A2B3]">
          Access requests are managed through the Request Center.
        </p>
      </section>
    </div>
  )
}

type TestPriority = "P0" | "P1" | "P2"

const ALL_PRIORITIES: TestPriority[] = ["P0", "P1", "P2"]

type SuiteSelectorProps = {
  value: TestPriority[]
  onChange: (value: TestPriority[]) => void
  projectName: string
}

function ProjectInfoTooltip({ type }: { type: "primary" | "pod" }) {
  const [open, setOpen] = useState(false)
  const tooltipId = useId()
  const isPrimary = type === "primary"

  const title = isPrimary ? "E2E Regression" : "Functional Test Suites"

  const description = isPrimary
    ? "Running this regression suite will trigger the E2E regression execution"
    : "These are the POD specific functional test suites"

  return (
    <span
      className="relative inline-flex items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Information icon */}
      <button
        type="button"
        aria-label={`More information about ${
          isPrimary ? "Primary Project" : "POD"
        }`}
        aria-describedby={open ? tooltipId : undefined}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setOpen(false)
            e.stopPropagation()
          }
        }}
        className={`inline-flex h-6 w-6 items-center justify-center rounded-md transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00539B] ${
          isPrimary
            ? "text-[#00539B] hover:bg-[#E8F0F7]"
            : "text-[#667085] hover:bg-[#F1F3F6]"
        }`}
      >
        {/* Compact question-mark icon */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9.5" />
          <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.7-2.5 2-2.5 4" />
          <circle cx="12" cy="17" r="0.8" fill="currentColor" stroke="none" />
        </svg>
      </button>

      {/* Tooltip container */}
      {open && (
        <span
          id={tooltipId}
          role="tooltip"
          className="absolute bottom-full left-0 z-50 mb-1 w-[260px] max-w-[calc(100vw-24px)] rounded-lg border border-[#BCD3E6] bg-[#F0F6FC] p-3 text-left shadow-lg"
        >
          {/* Tooltip title */}
          <span className="mb-1 block text-[12px] font-bold text-[#003B70]">
            {title}
          </span>

          {/* Tooltip description */}
          <span className="block text-[12px] font-normal leading-[1.5] text-[#526174]">
            {description}
          </span>

          {/* Arrow with border, aligned near bottom-left */}
          <span
            aria-hidden="true"
            className="absolute left-[8px] top-[calc(100%-1px)] z-10 h-[10px] w-[10px] -translate-y-1/2 rotate-45 border-b border-r border-[#BCD3E6] bg-[#F0F6FC]"
          />
        </span>
      )}
    </span>
  )
}

function SuiteSelector({ value, onChange, projectName }: SuiteSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const parentCheckboxRef = useRef<HTMLInputElement>(null)

  const selectedCount = value.length
  const allSelected = selectedCount === ALL_PRIORITIES.length
  const partiallySelected = selectedCount > 0 && !allSelected

  const displayText = allSelected
    ? "Test Suites"
    : selectedCount === 0
      ? "Select suites"
      : `Test Suites (${selectedCount}/3)`

  useEffect(() => {
    if (parentCheckboxRef.current) {
      parentCheckboxRef.current.indeterminate = partiallySelected
    }
  }, [partiallySelected, isOpen, isExpanded])

  useEffect(() => {
    if (!isOpen) return

    const handleOutsideClick = (event: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen])

  const toggleRegression = () => {
    onChange(allSelected ? [] : [...ALL_PRIORITIES])
  }

  const togglePriority = (priority: TestPriority) => {
    if (value.includes(priority)) {
      onChange(value.filter((item) => item !== priority))
    } else {
      onChange(
        ALL_PRIORITIES.filter(
          (item) => item === priority || value.includes(item),
        ),
      )
    }
  }

  return (
    <div ref={containerRef} className="relative w-[180px]">
      {/* Compact combobox-style trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={`Select test suites for ${projectName}`}
        className={`flex h-9 w-full items-center justify-between gap-2 rounded-lg border bg-white px-3 text-left text-[12px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003B70] ${
          isOpen
            ? "border-[#003B70] text-[#17233D]"
            : "border-[#DDE3E9] text-[#34445C] hover:border-[#9CB6CD]"
        }`}
      >
        <span className="truncate">{displayText}</span>

        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`shrink-0 text-[#526174] transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Floating hierarchical dropdown */}
      {isOpen && (
        <div
          role="dialog"
          aria-label={`Regression suite options for ${projectName}`}
          className="absolute left-0 top-full z-50 mt-1 w-[250px] rounded-xl border border-[#DDE3E9] bg-white p-2 shadow-lg"
        >
          {/* Regression parent */}
          <div className="flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-[#F4F8FC]">
            <button
              type="button"
              onClick={() => setIsExpanded((current) => !current)}
              aria-expanded={isExpanded}
              aria-label={
                isExpanded
                  ? "Collapse Regression priorities"
                  : "Expand Regression priorities"
              }
              className="flex size-6 shrink-0 items-center justify-center rounded text-[#526174] hover:bg-[#E8F0F7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#003B70]"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className={`transition-transform ${
                  isExpanded ? "" : "-rotate-90"
                }`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            <label className="flex flex-1 cursor-pointer items-center gap-2">
              <input
                ref={parentCheckboxRef}
                type="checkbox"
                checked={allSelected}
                onChange={toggleRegression}
                className="size-4 cursor-pointer accent-[#003B70]"
              />

              <span className="text-[13px] font-semibold text-[#17233D]">
                Test Suites
              </span>
            </label>

            <span className="text-[11px] text-[#526174]">
              {selectedCount}/3
            </span>
          </div>

          {/* Priority children */}
          {isExpanded && (
            <div className="ml-5 mt-1 space-y-1 border-l border-[#DDE3E9] pl-4">
              {ALL_PRIORITIES.map((priority) => (
                <label
                  key={priority}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 hover:bg-[#F4F8FC]"
                >
                  <input
                    type="checkbox"
                    checked={value.includes(priority)}
                    onChange={() => togglePriority(priority)}
                    className="size-4 cursor-pointer accent-[#003B70]"
                  />

                  <span className="text-[12px] text-[#34445C]">
                    {priority} Test Cases
                  </span>
                </label>
              ))}
            </div>
          )}

          <div className="mt-2 flex items-center justify-between border-t border-[#E9EDF1] px-2 pt-3">
            <span className="text-[11px] text-[#526174]">
              {selectedCount} of 3 selected
            </span>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md bg-[#003B70] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#00539B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003B70]"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

type PriorityResult = {
  pass: number
  fail: number
  notExecuted: number
}

type PriorityReportData = {
  P0: PriorityResult
  P1: PriorityResult
  P2: PriorityResult
}

type PriorityReportProps = {
  results: PriorityReportData
}
function PriorityReport({ results }: PriorityReportProps) {
  const priorities = ["P0", "P1", "P2"] as const

  return (
    <div className="flex min-w-[255px] flex-col items-center gap-2">
      {/* Three pills in one horizontal row */}
      <div className="grid w-full grid-cols-3 gap-2">
        {priorities.map((priority) => {
          const result = results[priority]

          const total = result.pass + result.fail + result.notExecuted

          const passed = result.pass
          const passPercent = total > 0 ? (result.pass / total) * 100 : 0

          const failPercent = total > 0 ? (result.fail / total) * 100 : 0

          return (
            <div
              key={priority}
              className="group relative min-w-0 hover:z-50 focus:z-50"
              tabIndex={0}
              aria-label={`${priority}: ${result.pass} passed, ${result.fail} failed, ${result.notExecuted} not executed`}
            >
              <div className="mb-1 text-center text-[11px] font-semibold text-[#34445C]">
                {priority}
              </div>

              {/* Segmented progress pill */}
              <div
                className={`flex h-2.5 w-full overflow-hidden rounded-full ${
                  total === 0 ? "bg-[#CBD5E1]" : "bg-[#FACC15]"
                }`}
              >
                {" "}
                <div
                  className="bg-[#16A34A]"
                  style={{ width: `${passPercent}%` }}
                />
                <div
                  className="bg-[#DC2626]"
                  style={{ width: `${failPercent}%` }}
                />
              </div>

              <div className="mt-1 text-center text-[10px] text-[#526174]">
                {passed}/{total}
              </div>

              {/* Hover and keyboard-focus popover */}
              <div
                className={`pointer-events-none absolute bottom-full z-[100] mb-2 hidden w-[185px] rounded-lg border border-[#DDE3E9] bg-white p-3 text-left shadow-xl group-hover:block group-focus:block ${
                  priority === "P0"
                    ? "left-0"
                    : priority === "P2"
                      ? "right-0"
                      : "left-1/2 -translate-x-1/2"
                }`}
              >
                <div className="mb-2 text-[12px] font-bold text-[#17233D]">
                  {priority} Test Cases
                </div>

                <div className="space-y-2 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[#526174]">
                      <span className="size-2 rounded-full bg-[#16A34A]" />
                      Pass
                    </span>
                    <span className="font-semibold text-[#17233D]">
                      {result.pass}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[#526174]">
                      <span className="size-2 rounded-full bg-[#DC2626]" />
                      Fail
                    </span>
                    <span className="font-semibold text-[#17233D]">
                      {result.fail}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[#526174]">
                      <span className="size-2 rounded-full bg-[#FACC15]" />
                      Not Executed
                    </span>
                    <span className="font-semibold text-[#17233D]">
                      {result.notExecuted}
                    </span>
                  </div>
                </div>

                <div className="mt-2 flex justify-between border-t border-[#E9EDF1] pt-2 text-[11px] font-semibold text-[#17233D]">
                  <span>Total</span>
                  <span>{total}</span>
                </div>

                <div className="absolute left-1/2 top-full -translate-x-1/2 border-x-[6px] border-t-[6px] border-x-transparent border-t-white" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function AutomationTests() {
  const projects = useAutomationProjects()

  const [selectedSuites, setSelectedSuites] =
    useState<Record<string, TestPriority[]>>({})

  const demoExecutionScenarios: PriorityReportData[] = [
    {
      P0: { pass: 10, fail: 0, notExecuted: 0 },
      P1: { pass: 10, fail: 0, notExecuted: 0 },
      P2: { pass: 10, fail: 0, notExecuted: 0 },
    },
    {
      P0: { pass: 0, fail: 0, notExecuted: 10 },
      P1: { pass: 0, fail: 0, notExecuted: 10 },
      P2: { pass: 0, fail: 0, notExecuted: 10 },
    },
    {
      P0: { pass: 8, fail: 2, notExecuted: 0 },
      P1: { pass: 0, fail: 0, notExecuted: 10 },
      P2: { pass: 7, fail: 1, notExecuted: 2 },
    },
    {
      P0: { pass: 0, fail: 0, notExecuted: 0 },
      P1: { pass: 0, fail: 0, notExecuted: 0 },
      P2: { pass: 0, fail: 0, notExecuted: 0 },
    },
  ]

  const newPodIds = new Set(["e2e-qe-eng-ops", "accupick-web", "accupick-app"])

  const demoResultsByProject: Record<string, PriorityReportData> =
    Object.fromEntries(
      projects.map((project, index) => [
        project.id,
        newPodIds.has(project.id)
          ? EMPTY_PRIORITY_RESULTS
          : demoExecutionScenarios[index % demoExecutionScenarios.length],
      ]),
    )

  const [priorityResults, setPriorityResults] =
    useState<Record<string, PriorityReportData>>({})
  const [expandedSuites, setExpandedSuites] = useState<Set<string>>(
    () => new Set(),
  )

  const [runningProject, setRunningProject] = useState<string | null>(null)

  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(
    () =>
      new Set(
        projects
          .filter((project) => project.type === "primary")
          .slice(0, 1)
          .map((project) => project.id),
      ),
  )

  const [runModal, setRunModal] = useState<{
    suite: string
    requestNumber: string
  } | null>(null)

  const runProject = (projectId: string) => {
    const selected = selectedSuites[projectId] ?? ALL_PRIORITIES

    if (selected.length === 0 || runningProject !== null) return

    const project = projects.find((p) => p.id === projectId)
    if (!project) return

    const requestNumber = `REQ-${Date.now()}`
    const historyId = `${requestNumber}-${projectId}`

    const suite =
      selected.length === ALL_PRIORITIES.length
        ? "Regression"
        : selected.map((priority) => `${priority} Test Cases`).join(", ")

    const historyRecord: AutomationHistoryRecord = {
      id: historyId,
      projectId,
      project: project.name,
      type: project.type === "primary" ? "Primary Project" : "POD",
      suite,
      status: "Running",
      submittedOn: new Date().toISOString(),
      reportUrl: `#${projectId}-report`,
    }

    saveAutomationHistory(historyRecord)

    setRunningProject(projectId)

    setRunModal({
      suite: project.name,
      requestNumber,
    })

    // Clear previous results when starting a new run
    setPriorityResults((current) => ({
      ...current,
      [projectId]: {
        P0: { pass: 0, fail: 0, notExecuted: 10 },
        P1: { pass: 0, fail: 0, notExecuted: 10 },
        P2: { pass: 0, fail: 0, notExecuted: 10 },
      },
    }))

    window.setTimeout(() => {
      const demoResults: PriorityReportData = {
        P0: selected.includes("P0")
          ? { pass: 8, fail: 2, notExecuted: 0 }
          : { pass: 0, fail: 0, notExecuted: 10 },

        P1: selected.includes("P1")
          ? { pass: 10, fail: 0, notExecuted: 0 }
          : { pass: 0, fail: 0, notExecuted: 10 },

        P2: selected.includes("P2")
          ? { pass: 7, fail: 1, notExecuted: 2 }
          : { pass: 0, fail: 0, notExecuted: 10 },
      }

      setPriorityResults((current) => ({
        ...current,
        [projectId]: demoResults,
      }))

      const hasFailures = selected.some(
        (priority) => demoResults[priority].fail > 0,
      )

      updateAutomationHistoryStatus(
        historyId,
        hasFailures ? "Failed" : "Passed",
        demoResults,
      )

      setRunningProject(null)
    }, 1200)
  }

  const toggleProject = (projectId: string) => {
    setExpandedProjects((current) => {
      if (current.has(projectId)) {
        return new Set<string>()
      }

      return new Set<string>([projectId])
    })
  }

  return (
    <>
      <div>
        <div>
          <h1 className="text-[28px] font-bold leading-10 tracking-[-0.035em] text-[#13203d] sm:text-[34px]">
            Automation overview
          </h1>
          <p className="mt-2 h-5 max-w-xl text-[12px] leading-5 text-[#69748b]">
            Select a suite and run end-to-end tests for any project in your
            workspace.
          </p>
        </div>
      </div>

      <section className="relative mt-8 overflow-visible rounded-xl border border-[#dde3ea] bg-white shadow-[0_4px_18px_rgba(31,45,72,0.05)]">
        <div className="relative flex items-center justify-between border-b border-[#e8ebef] px-6 py-2.5">
          <div
            className="ml-auto flex flex-wrap items-center justify-end gap-x-4 gap-y-2"
            aria-label="Report status legend"
          >
            <div className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full bg-[#16A34A]"
                aria-hidden="true"
              />
              <span className="text-[12px] font-medium text-[#526174]">
                Passed
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full bg-[#DC2626]"
                aria-hidden="true"
              />
              <span className="text-[12px] font-medium text-[#526174]">
                Failed
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full bg-[#FACC15]"
                aria-hidden="true"
              />
              <span className="text-[12px] font-medium text-[#526174]">
                Not Executed
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-visible">
          <table className="w-full min-w-[820px] border-collapse text-left">
            <thead>
              <tr className="bg-[#F4F8FC]  text-[11px] font-bold uppercase tracking-[0.13em] text-[#526174]">
                <th className="w-[31%] px-6 py-3.5">Project</th>
                <th className="w-[20%] px-6 py-3.5">Suite</th>
                <th className="w-[15%] px-6 py-3.5">Action</th>
                <th className="w-[24%] px-6 py-3.5">Last run</th>
                <th className="w-[10%] px-6 py-3.5 text-center">Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf0f3]">
              {projects.map((project, index) => {
                const isPrimary = project.type === "primary"

                const isRunning = runningProject === project.id
                const isExpanded = expandedProjects.has(project.id)

                if (
                  project.parentId &&
                  !expandedProjects.has(project.parentId)
                ) {
                  return null
                }

                return (
                  <tr
                    key={project.id}
                    className={`text-[13px] transition ${
                      isPrimary
                        ? "bg-white hover:bg-[#F8FAFC]"
                        : "hover:bg-[#f6f9fc]"
                    } ${
                      isPrimary && index !== 0
                        ? "border-t-2 border-t-[#dce3eb]"
                        : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div
                        className={`flex items-center gap-3 ${
                          isPrimary ? "" : "pl-7"
                        }`}
                      >
                        {isPrimary ? (
                          <button
                            type="button"
                            onClick={() => toggleProject(project.id)}
                            className="group flex items-center gap-3 rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-[#00539b] focus-visible:ring-offset-2"
                            aria-expanded={isExpanded}
                          >
                            <span className="grid size-9 place-items-center rounded-lg bg-[#e5f3fa] text-[#00539b] transition group-hover:bg-[#d3eaf6]">
                              <AccordionIcon
                                expanded={isExpanded}
                                className="size-[18px]"
                              />
                            </span>
                            <span>
                              <span className="font-bold text-[#1c2945]">
                                {project.name}
                              </span>
                              <div className="flex items-center gap-1">
                                <span>Primary Project</span>
                                <ProjectInfoTooltip type="primary" />
                              </div>
                            </span>
                          </button>
                        ) : (
                          <span className="flex items-center gap-2 text-[#a7b0bf]">
                            <span className="h-px w-3 bg-[#c8d0db]" />
                          </span>
                        )}
                        {!isPrimary && (
                          <div>
                            <span className="block font-semibold text-[#1c2945]">
                              {project.name}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <span>POD</span>
                              <ProjectInfoTooltip type="pod" />
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    {isPrimary ? (
                      <td colSpan={4} className="bg-transparent" />
                    ) : (
                      <>
                        <td className="px-6 py-4">
                          <SuiteSelector
                            projectName={project.name}
                            value={selectedSuites[project.id] ?? ALL_PRIORITIES}
                            onChange={(priorities) => {
                              setSelectedSuites((current) => ({
                                ...current,
                                [project.id]: priorities,
                              }))
                            }}
                          />
                        </td>

                        <td className="px-6 py-4">
                          <button
                            type="button"
                            onClick={() => {
                              const selected =
                                selectedSuites[project.id] ?? ALL_PRIORITIES

                              if (selected.length === 0) return

                              runProject(project.id)
                            }}
                            disabled={isRunning}
                            className="inline-flex h-9 min-w-[88px] items-center justify-center gap-2 rounded-lg bg-[#00539b] px-4 text-[12px] font-bold text-white shadow-[0_3px_8px_rgba(8,127,195,0.18)] transition hover:bg-[#003b70] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00539b] focus-visible:ring-offset-2 disabled:cursor-wait disabled:bg-[#78a9c7]"
                          >
                            {isRunning ? (
                              <span className="size-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                            ) : (
                              <PlayIcon className="size-4.5" />
                            )}
                            {isRunning ? "Running" : "Run"}
                          </button>
                        </td>

                        <td className="px-6 py-4">
                          {(() => {
                            const results =
                              priorityResults[project.id] ??
                              demoResultsByProject[project.id] ??
                              EMPTY_PRIORITY_RESULTS

                            const hasExecutionHistory = ([
                              "P0",
                              "P1",
                              "P2",
                            ] as const).some((priority) => {
                              const result = results[priority]
                              return (
                                result.pass + result.fail + result.notExecuted >
                                0
                              )
                            })

                            if (!hasExecutionHistory) {
                              return (
                                <div className="w-full text-center">
                                  <span className="text-[12px] font-medium text-[#526174]">
                                    --
                                  </span>
                                </div>
                              )
                            }

                            return (
                              <div className="flex items-center gap-2">
                                <ClockIcon className="size-4 shrink-0 text-[#9aa4b5]" />

                                <div className="flex flex-col gap-0.5">
                                  <span className="text-[12px] font-medium text-[#526174]">
                                    {project.lastRun?.split("·")[0]?.trim() ||
                                      "--"}
                                  </span>

                                  <span className="text-[12px] font-medium text-[#526174]">
                                    {project.lastRun?.split("·")[1]?.trim()}
                                  </span>
                                </div>
                              </div>
                            )
                          })()}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-col items-center gap-2">
                            <PriorityReport
                              results={
                                priorityResults[project.id] ??
                                demoResultsByProject[project.id] ??
                                EMPTY_PRIORITY_RESULTS
                              }
                            />

                            <a
                              href={`#${project.id}-report`}
                              className="inline-flex items-center gap-1.5 rounded-md text-[12px] font-bold text-[#00539b] underline-offset-4 transition hover:text-[#003b70] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00539b]"
                            >
                              View Report
                              <ExternalLinkIcon className="size-3.5" />
                            </a>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Run Status Modal */}
        {/* Temporary Run Status Modal */}
        {/* Run Status Modal */}
        {runModal && (
          <RunStatusModal
            open={true}
            suite={runModal.suite}
            requestNumber={runModal.requestNumber}
            onClose={() => setRunModal(null)}
          />
        )}
      </section>
    </>
  )
}

function ApiHealthSection() {
  type Status = "Operational" | "Degraded" | "Down" | "Unknown"
  type Environment = "QA2" | "Prod"
  type ProjectName = "Fulfillment" | "AcuPick" | "DOMS" | "DCP"

  type ApiService = {
    id: string
    name: string
    environment: Environment
    project: ProjectName
    status: Status
    host: string
    responseMs: number | null
    checkedAt: string
    error?: string
  }

  const initialServices: ApiService[] = [
    {
      id: "np-auth",
      name: "Auth Service (Okta)",
      environment: "QA2",
      project: "Fulfillment",
      status: "Down",
      host: "QA2 authentication endpoint",
      responseMs: 2418,
      checkedAt: "4:53:33 PM",
      error: "Token request failed (HTTP 400)",
    },
    {
      id: "np-cart",
      name: "Cart API",
      environment: "QA2",
      project: "Fulfillment",
      status: "Operational",
      host: "QA2 Cart API endpoint",
      responseMs: 1281,
      checkedAt: "4:53:33 PM",
    },
    {
      id: "np-checkout",
      name: "Checkout API",
      environment: "QA2",
      project: "Fulfillment",
      status: "Operational",
      host: "QA2 Checkout API endpoint",
      responseMs: 1272,
      checkedAt: "4:53:33 PM",
    },
    {
      id: "np-order",
      name: "Order API (OSCD)",
      environment: "QA2",
      project: "Fulfillment",
      status: "Operational",
      host: "QA2 Order API endpoint",
      responseMs: 1608,
      checkedAt: "4:53:33 PM",
    },
    {
      id: "np-slot",
      name: "Slot Promise API",
      environment: "QA2",
      project: "Fulfillment",
      status: "Operational",
      host: "QA2 Slot Promise endpoint",
      responseMs: 1604,
      checkedAt: "4:53:33 PM",
    },
    {
      id: "np-accupick",
      name: "AccuPick",
      environment: "QA2",
      project: "Fulfillment",
      status: "Operational",
      host: "QA2 AccuPick endpoint",
      responseMs: 1335,
      checkedAt: "4:53:33 PM",
    },
    {
      id: "np-tpl",
      name: "TPL Webhooks",
      environment: "QA2",
      project: "Fulfillment",
      status: "Operational",
      host: "QA2 TPL Webhooks endpoint",
      responseMs: 1339,
      checkedAt: "4:53:33 PM",
    },
    {
      id: "prod-cart",
      name: "Cart API",
      environment: "Prod",
      project: "Fulfillment",
      status: "Operational",
      host: "Production Cart API endpoint",
      responseMs: 1312,
      checkedAt: "4:53:33 PM",
    },
    {
      id: "prod-checkout",
      name: "Checkout API",
      environment: "Prod",
      project: "Fulfillment",
      status: "Operational",
      host: "Production Checkout API endpoint",
      responseMs: 1340,
      checkedAt: "4:53:33 PM",
    },
    {
      id: "prod-order",
      name: "Order API (OSCD)",
      environment: "Prod",
      project: "Fulfillment",
      status: "Operational",
      host: "Production Order API endpoint",
      responseMs: 1304,
      checkedAt: "4:53:33 PM",
    },
    {
      id: "prod-slot",
      name: "Slot Promise API",
      environment: "Prod",
      project: "Fulfillment",
      status: "Operational",
      host: "Production Slot Promise endpoint",
      responseMs: 1346,
      checkedAt: "4:53:33 PM",
    },
    {
      id: "prod-accupick",
      name: "AccuPick",
      environment: "Prod",
      project: "Fulfillment",
      status: "Operational",
      host: "Production AccuPick endpoint",
      responseMs: 1418,
      checkedAt: "4:53:33 PM",
    },
    {
      id: "prod-tpl",
      name: "TPL Webhooks",
      environment: "Prod",
      project: "Fulfillment",
      status: "Operational",
      host: "Production TPL Webhooks endpoint",
      responseMs: 1423,
      checkedAt: "4:53:33 PM",
    },
  ]

  // Illustrative AcuPick data for prototype review; replace with real endpoints/results.
  const acuPickSampleServices: ApiService[] = [
    {
      id: "acupick-qa-orders",
      name: "Picking Orders API",
      environment: "QA2",
      project: "AcuPick",
      status: "Operational",
      host: "QA2 Picking Orders endpoint (sample)",
      responseMs: 184,
      checkedAt: "Demo data",
    },
    {
      id: "acupick-qa-tasks",
      name: "Pick Tasks API",
      environment: "QA2",
      project: "AcuPick",
      status: "Operational",
      host: "QA2 Pick Tasks endpoint (sample)",
      responseMs: 231,
      checkedAt: "Demo data",
    },
    {
      id: "acupick-qa-inventory",
      name: "Inventory Sync API",
      environment: "QA2",
      project: "AcuPick",
      status: "Degraded",
      host: "QA2 Inventory Sync endpoint (sample)",
      responseMs: 1260,
      checkedAt: "Demo data",
      error: "Elevated response time (sample)",
    },
    {
      id: "acupick-prod-orders",
      name: "Picking Orders API",
      environment: "Prod",
      project: "AcuPick",
      status: "Operational",
      host: "Prod Picking Orders endpoint (sample)",
      responseMs: 142,
      checkedAt: "Demo data",
    },
    {
      id: "acupick-prod-tasks",
      name: "Pick Tasks API",
      environment: "Prod",
      project: "AcuPick",
      status: "Operational",
      host: "Prod Pick Tasks endpoint (sample)",
      responseMs: 177,
      checkedAt: "Demo data",
    },
    {
      id: "acupick-prod-inventory",
      name: "Inventory Sync API",
      environment: "Prod",
      project: "AcuPick",
      status: "Operational",
      host: "Prod Inventory Sync endpoint (sample)",
      responseMs: 205,
      checkedAt: "Demo data",
    },
  ]

  // DOMS and DCP remain unconfigured; AcuPick uses illustrative sample data.
  // Add each project's real APIs here as they become available.
  // Empty projects display a clear placeholder rather than invented health results.
  const projects: ProjectName[] = ["Fulfillment", "AcuPick", "DOMS", "DCP"]
  const [expandedProject, setExpandedProject] = useState<ProjectName | null>(
    "Fulfillment",
  )
  const [refreshingProject, setRefreshingProject] =
    useState<ProjectName | null>(null)
  const [lastRefreshedProject, setLastRefreshedProject] =
    useState<ProjectName | null>(null)

  const [services, setServices] = useState<ApiService[]>([
    ...initialServices,
    ...acuPickSampleServices,
  ])
  const [selectedService, setSelectedService] = useState<ApiService | null>(
    null,
  )
  const [showFullReport, setShowFullReport] = useState(false)

  const [refreshStep, setRefreshStep] = useState(0)
  const [refreshProgress, setRefreshProgress] = useState(0)
  const [refreshComplete, setRefreshComplete] = useState(false)
  const [previewRefreshedAt, setPreviewRefreshedAt] = useState<string | null>(
    null,
  )

  const refreshTimersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const refreshMessages = [
    "Connecting to API endpoints...",
    "Checking service health...",
    "Collecting response times...",
    "Preparing updated results...",
  ]

  const clearRefreshTimers = () => {
    refreshTimersRef.current.forEach(clearTimeout)
    refreshTimersRef.current = []
  }

  useEffect(() => {
    return () => {
      refreshTimersRef.current.forEach(clearTimeout)
      refreshTimersRef.current = []
    }
  }, [])

  const handleRefresh = (project: ProjectName) => {
    if (refreshingProject !== null) return

    clearRefreshTimers()

    setRefreshingProject(project)
    setLastRefreshedProject(null)
    setRefreshComplete(false)
    setRefreshStep(0)
    setRefreshProgress(5)
    setSelectedService(null)
    setShowFullReport(false)

    const stages = [
      { delay: 500, step: 0, progress: 15 },
      { delay: 1200, step: 1, progress: 40 },
      { delay: 2100, step: 2, progress: 70 },
      { delay: 3000, step: 3, progress: 90 },
    ]

    stages.forEach(({ delay, step, progress }) => {
      const timer = setTimeout(() => {
        setRefreshStep(step)
        setRefreshProgress(progress)
      }, delay)

      refreshTimersRef.current.push(timer)
    })

    const finishTimer = setTimeout(
      () => {
        const refreshedAt = new Date().toLocaleTimeString()

        setRefreshProgress(100)
        setPreviewRefreshedAt(refreshedAt)

        // Prototype only:
        // Preserve sample API statuses and response times.
        // Replace this with real API results when connected.
        setServices((current) =>
          current.map((service) =>
            service.project === project
              ? { ...service, checkedAt: refreshedAt }
              : service,
          ),
        )

        setRefreshingProject(null)
        setLastRefreshedProject(project)
        setRefreshComplete(true)
        refreshTimersRef.current = []
      },
      3700,
    )

    refreshTimersRef.current.push(finishTimer)
  }

  const statusColors: Record<Status, {
    dot: string
    text: string
    badge: string
    border: string
  }> = {
    Operational: {
      dot: "bg-[#21A179]",
      text: "text-[#16765B]",
      badge: "bg-[#E8F7EE]",
      border: "border-l-[#21A179]",
    },
    Degraded: {
      dot: "bg-[#D9A441]",
      text: "text-[#9A6B13]",
      badge: "bg-[#FFF5E3]",
      border: "border-l-[#D9A441]",
    },
    Down: {
      dot: "bg-[#D94B57]",
      text: "text-[#C04755]",
      badge: "bg-[#FCEBED]",
      border: "border-l-[#D94B57]",
    },
    Unknown: {
      dot: "bg-[#98A2B3]",
      text: "text-[#687386]",
      badge: "bg-[#EEF1F5]",
      border: "border-l-[#98A2B3]",
    },
  }

  const renderApiCard = (service: ApiService) => {
    const colors = statusColors[service.status]

    return (
      <div
        key={service.id}
        className={`
        flex min-h-[128px] w-full flex-col
        rounded-xl border border-[#DDE3E9] border-l-4
        bg-white px-3 py-2.5 text-left shadow-sm
        ${colors.border}
      `}
      >
        <div className="flex w-full items-center justify-between gap-3">
          <h3 className="min-w-0 flex-1 truncate text-[13px] font-bold leading-5 text-[#17233D]">
            {service.name}
          </h3>

          <span
            className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold ${colors.badge} ${colors.text}`}
          >
            <span className={`size-1.5 rounded-full ${colors.dot}`} />
            {service.status}
          </span>
        </div>

        <p
          title={service.host}
          className="mt-1.5 truncate text-[11px] text-[#8791A0]"
        >
          {service.host}
        </p>

        {service.error && (
          <p className="mt-1 line-clamp-2 text-[11px] text-[#C04755]">
            {service.error}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 border-t border-[#EEF1F4] pt-1.5">
          <div>
            <p className="text-[10px] text-[#98A2B3]">Response</p>
            <p className="mt-0.5 text-[12px] font-bold text-[#26324C]">
              {service.responseMs === null ? "—" : `${service.responseMs} ms`}
            </p>
          </div>

          <div className="text-right">
            <p className="text-[10px] text-[#98A2B3]">Checked</p>
            <p className="mt-0.5 text-[11px] font-semibold text-[#526174]">
              {service.checkedAt}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const renderEnvironment = (
    project: ProjectName,
    environment: Environment,
  ) => {
    const environmentServices = services.filter(
      (service) =>
        service.project === project && service.environment === environment,
    )
    const healthy = environmentServices.filter(
      (service) => service.status === "Operational",
    ).length

    return (
      <section className="mt-4 first:mt-0">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-[16px] font-bold text-[#17233D]">
              {environment}
            </h3>
            <p className="mt-0.5 text-[11px] text-[#526174]">
              {environmentServices.length} monitored endpoints
            </p>
          </div>
          {environmentServices.length > 0 && (
            <span className="rounded-full border border-[#DDE3E9] bg-white px-3 py-1 text-[11px] font-semibold text-[#526174]">
              {healthy} / {environmentServices.length} operational
            </span>
          )}
        </div>
        {environmentServices.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {environmentServices.map(renderApiCard)}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-[#C9D5DF] bg-white/70 px-4 py-6 text-center text-[12px] text-[#687386]">
            No APIs configured for {project} / {environment} yet.
          </div>
        )}
      </section>
    )
  }

  const reportServices = selectedService
    ? [selectedService]
    : services.filter((service) => service.project === expandedProject)

  return (
    <div className="pb-10">
      {/* Page header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold tracking-[-0.035em] text-[#13203D] sm:text-[34px]">
            API Health
          </h1>

          <p className="mt-2 text-[13px] text-[#667085]">
            Monitor API availability, response times, and service health across
            environments.
          </p>
        </div>
      </div>

      {/* Project accordions: only one project may be open at a time. */}
      <div className="space-y-3">
        {projects.map((project) => {
          const isOpen = expandedProject === project
          const isProjectRefreshing = refreshingProject === project
          const projectServices = services.filter(
            (service) => service.project === project,
          )
          const operationalCount = projectServices.filter(
            (service) => service.status === "Operational",
          ).length
          return (
            <section
              key={project}
              className="overflow-hidden rounded-xl border border-[#DDE3E9] bg-white shadow-sm"
            >
              <div className="flex items-center gap-2 px-4 py-3 sm:px-5">
                <button
                  type="button"
                  onClick={() => setExpandedProject(isOpen ? null : project)}
                  aria-expanded={isOpen}
                  aria-controls={`api-project-${project}`}
                  className="flex min-w-0 flex-1 items-center gap-3 rounded-md py-1 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003B70]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="size-5 shrink-0 text-[#003B70]"
                    aria-hidden="true"
                  >
                    <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10H3V7Z" />
                  </svg>
                  <span className="truncate text-[15px] font-bold text-[#17233D]">
                    {project}
                  </span>
                  <span className="shrink-0 rounded-full border border-[#DDE3E9] bg-[#F4F7FA] px-2.5 py-1 text-[11px] font-semibold text-[#526174]">
                    {operationalCount} / {projectServices.length} operational
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`size-4 shrink-0 text-[#526174] transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => handleRefresh(project)}
                  disabled={
                    refreshingProject !== null || projectServices.length === 0
                  }
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-[#AFC1D3] bg-white px-3 py-2 text-[12px] font-semibold text-[#003B70] hover:bg-[#F1F6FA] disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={`Refresh ${project} API health`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`size-4 ${
                      isProjectRefreshing ? "animate-spin" : ""
                    }`}
                    aria-hidden="true"
                  >
                    <path d="M20 11a8 8 0 0 0-14-5L4 8" />
                    <path d="M4 4v4h4" />
                    <path d="M4 13a8 8 0 0 0 14 5l2-2" />
                    <path d="M20 20v-4h-4" />
                  </svg>
                  {isProjectRefreshing ? "Refreshing..." : "Refresh"}
                </button>
              </div>
              {isOpen && (
                <div
                  id={`api-project-${project}`}
                  className="border-t border-[#DDE3E9] bg-[#EDF2F6] px-4 pb-5 pt-4 sm:px-5"
                >
                  {lastRefreshedProject === project && refreshComplete && (
                    <p
                      role="status"
                      className="mb-3 rounded-md border border-[#CBE7D8] bg-[#EFF9F3] px-3 py-2 text-[11px] text-[#16765B]"
                    >
                      Preview refresh complete for {project}
                      {previewRefreshedAt ? ` at ${previewRefreshedAt}` : ""}.
                    </p>
                  )}
                  {renderEnvironment(project, "QA2")}
                  <div className="my-5 border-t border-[#D5DFE8]" />
                  {renderEnvironment(project, "Prod")}
                </div>
              )}
            </section>
          )
        })}
      </div>

      {/* =====================================================
          FULL REPORT / SERVICE DETAILS DIALOG
      ===================================================== */}
      {(showFullReport || selectedService) && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#0B223D]/60 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="api-report-title"
            className="flex max-h-[90vh] w-full max-w-[850px] flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
          >
            <div className="atlas-modal-header shrink-0">
              {" "}
              <div>
                <h2
                  id="api-report-title"
                  className="text-[20px] font-bold text-[#13203D]"
                >
                  {selectedService
                    ? selectedService.name
                    : "API Health — Full Report"}
                </h2>

                <p className="mt-1 text-[12px] text-[#8791A0]">
                  {selectedService
                    ? "Service health details"
                    : `${reportServices.length} monitored APIs in ${expandedProject ?? "selected project"}`}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close report"
                onClick={() => {
                  setSelectedService(null)
                  setShowFullReport(false)
                }}
                className="rounded-lg px-2 py-1 text-xl text-[#687386] hover:bg-[#F4F6F8]"
              >
                ×
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#F8FAFC] p-5">
              {reportServices.map((service) => {
                const colors = statusColors[service.status]

                return (
                  <div
                    key={service.id}
                    className="rounded-lg border border-[#DDE3E9] bg-white p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-[14px] font-bold text-[#17233D]">
                        {service.name}
                      </h3>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${colors.badge} ${colors.text}`}
                      >
                        {service.status}
                      </span>
                    </div>

                    <dl className="mt-4 grid gap-4 text-[12px] sm:grid-cols-2">
                      <div>
                        <dt className="text-[#8791A0]">Project</dt>
                        <dd className="mt-1 font-semibold text-[#26324C]">
                          {service.project}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[#8791A0]">Environment</dt>
                        <dd className="mt-1 font-semibold text-[#26324C]">
                          {service.environment}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-[#8791A0]">Response Time</dt>
                        <dd className="mt-1 font-semibold text-[#26324C]">
                          {service.responseMs === null
                            ? "—"
                            : `${service.responseMs} ms`}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-[#8791A0]">Checked At</dt>
                        <dd className="mt-1 font-semibold text-[#26324C]">
                          {service.checkedAt}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-[#8791A0]">Host</dt>
                        <dd className="mt-1 break-all font-semibold text-[#26324C]">
                          {service.host}
                        </dd>
                      </div>

                      {service.error && (
                        <div className="sm:col-span-2">
                          <dt className="text-[#8791A0]">Error</dt>
                          <dd className="mt-1 font-semibold text-[#C04755]">
                            {service.error}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                )
              })}
            </div>

            <div className="flex shrink-0 justify-end border-t border-[#E9EDF1] bg-white px-6 py-4">
              <button
                type="button"
                onClick={() => {
                  setSelectedService(null)
                  setShowFullReport(false)
                }}
                className="rounded-lg bg-[#003B70] px-5 py-2.5 text-[12px] font-semibold text-white hover:bg-[#00539B]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          REFRESH ANIMATION OVERLAY
      ===================================================== */}
      {refreshingProject !== null && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B223D]/40 p-4 backdrop-blur-[3px]"
        >
          <div className="w-full max-w-[420px] rounded-2xl border border-[#DDE3E9] bg-white px-8 py-9 text-center shadow-2xl">
            {/* Spinner */}
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#E8F0F7]">
              <svg
                className="size-9 animate-spin text-[#003B70]"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="3"
                  opacity="0.15"
                />

                <path
                  d="M12 3a9 9 0 0 1 9 9"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h2 className="mt-5 text-[19px] font-bold text-[#13203D]">
              Refreshing {refreshingProject} API Health
            </h2>

            <p className="mt-2 min-h-[20px] text-[13px] text-[#687386]">
              {refreshMessages[refreshStep]}
            </p>

            {/* Progress bar */}
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#E8EDF3]">
              <div
                className="h-full rounded-full bg-[#003B70] transition-all duration-500 ease-out"
                style={{
                  width: `${refreshProgress}%`,
                }}
              />
            </div>

            <div className="mt-2 text-right text-[11px] font-semibold text-[#8791A0]">
              {refreshProgress}%
            </div>

            <p className="mt-4 text-[11px] text-[#98A2B3]">
              Checking QA2 and Prod environments
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

/* =========================================
   REQUEST CENTER TAB
========================================= */

type RequestType = "Add Project" | "Request Access" | "Revoke Access | Workflow Test"
type RequestStatus = "Submitted" | "In Progress" | "Completed" | "Failed"

type RequestRecord = {
  id: string
  type: RequestType
  enviornment: string
  status: RequestStatus
  submitted: string
  details: string
}

type AccessFormData = {
  projectName: string
  userEmail: string
  accessLevel: string
  accessDuration: string
  accessEndDate: string
  reason: string
}

type ProjectFormData = {
  projectName: string
  description: string
  ownerEmail: string
  projectType: string
  applicationUrl: string
  apiBaseUrl: string
  otherAutomationType: string
  repository: string
  framework: string
  environment: string
  needsCI: string
  workflowName: string
  branch: string
  schedule: string
  userEmail: string
  reason: string
}

const emptyProjectForm: ProjectFormData = {
  projectName: "",
  description: "",
  ownerEmail: "",
  projectType: "",
  applicationUrl: "",
  apiBaseUrl: "",
  otherAutomationType: "",
  repository: "",
  framework: "",
  environment: "",
  needsCI: "",
  workflowName: "",
  branch: "",
  schedule: "",
  userEmail: "",
  reason: "",
}

const requestFieldClass =
  "mt-1.5 w-full rounded-lg border border-[#D5DCE5] bg-white px-3 py-2.5 text-[13px] text-[#17233D] outline-none focus:border-[#003B70] focus:ring-2 focus:ring-[#003B70]/10"

const requestLabelClass = "block text-[12px] font-semibold text-[#34445C]"

const requestPrimaryButton =
  "rounded-lg bg-[#003B70] px-6 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#00539B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003B70]"

const requestSecondaryButton =
  "rounded-lg border border-[#D5DCE5] bg-white px-5 py-2.5 text-[13px] font-semibold text-[#526174] transition-colors hover:bg-[#F0F5FA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003B70]"

// =====================================================
// FULL-SCREEN REQUEST ACCESS TAKEOVER
// =====================================================

function RequestAccessTakeover({
  onClose,
  onSubmit,
}: {
  onClose: () => void
  onSubmit: (data: AccessFormData) => void
}) {
  const [form, setForm] = useState<AccessFormData>({
    projectName: "",
    userEmail: "",
    accessLevel: "",
    accessDuration: "",
    accessEndDate: "",
    reason: "",
  })

  const update = (field: keyof AccessFormData, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit(form)
  }

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col overflow-hidden bg-[#F4F6F8]">
      {/* Full-screen takeover header */}
      <header className="flex shrink-0 items-center justify-between border-b border-[#DDE3E9] bg-white px-5 py-5 sm:px-10">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#778198]">
            ATLAS360 / Request Center
          </p>

          <h1 className="mt-1 text-[23px] font-bold text-[#13203D] sm:text-[28px]">
            Request Access to Automation Project
          </h1>

          <p className="mt-1 text-[12px] text-[#667085]">
            Submit a request for access to an automation project.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close request form"
          className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#DDE3E9] bg-white text-xl text-[#526174] hover:bg-[#F0F5FA]"
        >
          ×
        </button>
      </header>

      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        {/* Scrollable content */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-8 sm:px-10">
          <div className="mx-auto max-w-[900px] space-y-6">
            {/* Project access details */}
            <section className="rounded-xl border border-[#DDE3E9] bg-white p-6 shadow-sm">
              <div className="mb-6 border-b border-[#EEF1F4] pb-4">
                <h2 className="text-[17px] font-bold text-[#17233D]">
                  Project Access Details
                </h2>

                <p className="mt-1 text-[12px] text-[#667085]">
                  Select the project and specify the required access.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className={requestLabelClass}>
                  Automation Project *
                  <select
                    required
                    value={form.projectName}
                    onChange={(e) => update("projectName", e.target.value)}
                    className={requestFieldClass}
                  >
                    <option value="">Select project</option>
                    <option value="Fulfillment">Fulfillment</option>
                    <option value="AccuPick">AccuPick</option>
                    <option value="DOMS">DOMS</option>
                    <option value="DCP">DCP</option>
                    <option value="Enterprise Item">Enterprise Item</option>
                  </select>
                </label>

                <label className={requestLabelClass}>
                  User Email *
                  <input
                    required
                    type="email"
                    value={form.userEmail}
                    onChange={(e) => update("userEmail", e.target.value)}
                    placeholder="user@company.com"
                    className={requestFieldClass}
                  />
                </label>

                <label className={requestLabelClass}>
                  Access Level *
                  <select
                    required
                    value={form.accessLevel}
                    onChange={(e) => update("accessLevel", e.target.value)}
                    className={requestFieldClass}
                  >
                    <option value="">Select access level</option>
                    <option value="Viewer">Viewer</option>
                    <option value="Executor">Executor</option>
                    <option value="Project Admin">Project Admin</option>
                  </select>
                </label>

                <label className={requestLabelClass}>
                  Access Duration *
                  <select
                    required
                    value={form.accessDuration}
                    onChange={(e) => update("accessDuration", e.target.value)}
                    className={requestFieldClass}
                  >
                    <option value="">Select duration</option>
                    <option value="Permanent">Permanent</option>
                    <option value="Temporary">Temporary</option>
                  </select>
                </label>

                {/* Dynamic field */}
                {form.accessDuration === "Temporary" && (
                  <label className={requestLabelClass}>
                    Access End Date *
                    <input
                      required
                      type="date"
                      min={new Date().toLocaleDateString("en-CA")}
                      value={form.accessEndDate}
                      onChange={(e) => update("accessEndDate", e.target.value)}
                      className={requestFieldClass}
                    />
                  </label>
                )}

                {/* Dynamic approval information */}
                {form.accessLevel === "Project Admin" && (
                  <div className="rounded-lg border border-[#DCE8F3] bg-[#F7FAFD] p-4 sm:col-span-2">
                    <p className="text-[12px] font-bold text-[#003B70]">
                      Additional approval required
                    </p>

                    <p className="mt-1 text-[12px] text-[#687386]">
                      Project Admin access requires approval from the project
                      owner.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Business justification */}
            <section className="rounded-xl border border-[#DDE3E9] bg-white p-6 shadow-sm">
              <h2 className="text-[17px] font-bold text-[#17233D]">
                Business Justification
              </h2>

              <p className="mt-1 text-[12px] text-[#667085]">
                Explain why access is required.
              </p>

              <label className={`${requestLabelClass} mt-5`}>
                Reason for Access *
                <textarea
                  required
                  rows={5}
                  value={form.reason}
                  onChange={(e) => update("reason", e.target.value)}
                  placeholder="Describe the business purpose of this request..."
                  className={requestFieldClass}
                />
              </label>
            </section>
          </div>
        </div>

        {/* Fixed footer */}
        <footer className="flex shrink-0 items-center justify-between border-t border-[#DDE3E9] bg-white px-5 py-4 sm:px-10">
          <span className="hidden text-[12px] text-[#8791A0] sm:block">
            * Required fields
          </span>

          <div className="ml-auto flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className={requestSecondaryButton}
            >
              Cancel
            </button>

            <button type="submit" className={requestPrimaryButton}>
              Submit Request
            </button>
          </div>
        </footer>
      </form>
    </div>
  )
}

// =====================================================
// REQUEST CENTER SECTION
// =====================================================

type WorkflowTestFormProps = {
  onSubmit: (scenario: string, details: string) => string
}

const scenarios = [
  "Create a customized test order",
  "Create a sample test order",
  "Create and Fulfil the test order",
  "Fulfil the test order completely",
  "Cancel test order",
  "Web dashboard UI Sanity Check",
  "DCP UI validation",
  "Verify the order in Acupick dashboard",
] as const

type Scenario = typeof scenarios[number]
const workflowFieldClass =
  "w-full min-h-10 rounded-lg border border-[#DDE3E9] bg-white px-3 py-2 text-[13px] text-[#17233D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#003B70]"
const workflowLabelClass =
  "flex flex-col gap-1.5 text-[12px] font-semibold text-[#34445C]"

function WorkflowTestForm({ onSubmit }: WorkflowTestFormProps) {
  const [scenario, setScenario] = useState<Scenario | "">("")
  const [environment, setEnvironment] = useState("QA2")
  const [values, setValues] = useState<Record<string, string>>({
    userType: "Regular",
    slotType: "Regular",
    storeNumber: "3132",
    paymentType: "Credit Card",
    bagPreference: "Yes",
    quantity: "1",
    storeSettings: "Regular",
  })
  const [advanced, setAdvanced] = useState(false)
  const [error, setError] = useState("")
  const update = (key: string, value: string) => {
    setValues((old) => ({ ...old, [key]: value }))
    setError("")
  }
  const select = (
    key: string,
    title: string,
    options: string[],
    required = false,
  ) => (
    <label className={workflowLabelClass} key={key}>
      {title}
      {required ? " *" : ""}
      <select
        className={workflowFieldClass}
        value={values[key] ?? ""}
        onChange={(e) => update(key, e.target.value)}
        required={required}
      >
        <option value="">Select {title.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
  const input = (
    key: string,
    title: string,
    required = false,
    type = "text",
  ) => (
    <label className={workflowLabelClass} key={key}>
      {title}
      {required ? " *" : ""}
      <input
        className={workflowFieldClass}
        type={type}
        value={values[key] ?? ""}
        onChange={(e) => update(key, e.target.value)}
        required={required}
        placeholder={`Enter ${title.toLowerCase()}`}
      />
    </label>
  )
  const isCustom = scenario === scenarios[0] || scenario === scenarios[2]
  const isSample = scenario === scenarios[1]
  const isOrder =
    scenario === scenarios[3] ||
    scenario === scenarios[4] ||
    scenario === scenarios[7]
  const isStore = scenario === scenarios[5]
  const isDcp = scenario === scenarios[6]

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!scenario) {
      setError("Select a request type.")
      return
    }

    if (
      isCustom &&
      (!values.deliveryType || !values.itemType || !values.quantity)
    ) {
      setError("Delivery type, item type, and quantity are required.")
      return
    }

    if (isSample && !values.sampleOrderType) {
      setError("Select a sample order type.")
      return
    }

    if (isOrder && !values.orderNumber?.trim()) {
      setError("Order number is required.")
      return
    }

    if (scenario === scenarios[4] && !values.cancelledBy) {
      setError("Select who initiated cancellation.")
      return
    }

    if (isDcp && !values.dcpEnvironment) {
      setError("Select the DCP environment.")
      return
    }

    // Only fields relevant to the chosen scenario are recorded.
    // Never include credentials.
    const keys = isCustom
      ? [
          "userType",
          "deliveryType",
          "slotType",
          "storeNumber",
          "itemType",
          "quantity",
          "individualItemType",
          "storageZone",
          "storeSettings",
          "paymentType",
          "bagPreference",
          "userEmail",
        ]
      : isSample
        ? ["sampleOrderType", "userEmail"]
        : isOrder
          ? [
              "orderNumber",
              ...(scenario === scenarios[4] ? ["cancelledBy"] : []),
            ]
          : isStore
            ? ["storeNumber"]
            : isDcp
              ? ["dcpEnvironment"]
              : []

    const payload = Object.fromEntries(
      keys.filter((key) => values[key]).map((key) => [key, values[key]]),
    )

    // Existing submission functionality
    const requestNumber = onSubmit(
      scenario,
      `Environment: ${environment} | Configuration: ${JSON.stringify(payload)}`,
    )

    // Save the request to Request Center History
    saveRequestCenterHistory({
      requestNumber,
      requestType: scenario,
      status: "Submitted",
      environment,
      submittedOn: new Date().toISOString(),
      orderNumber: values.orderNumber || "",
    })
  }

  return (
    <div>
      <form
        onSubmit={submit}
        className="overflow-hidden border-t border-[#E9EDF1] bg-white"
      >
        <div className="border-b border-[#E9EDF1] px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
            <p className="text-[13px] leading-5 text-[#526174]">
              Select the type of request you'd like to submit and complete the
              required details
            </p>

            <span className="shrink-0 whitespace-nowrap text-[12px] text-[#667085]">
              * Required fields
            </span>
          </div>
        </div>

        <div className="grid gap-5 p-6 sm:grid-cols-2">
          <label className={workflowLabelClass}>
            Environment *
            <select
              className={workflowFieldClass}
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
            >
              <option value="QA2">QA2</option>
              <option disabled value="QA1">
                QA1 (unavailable)
              </option>
            </select>
          </label>
          <label className={workflowLabelClass}>
            Request Type *
            <select
              className={workflowFieldClass}
              value={scenario}
              required
              onChange={(e) => {
                setScenario(e.target.value as Scenario)
                setValues({
                  userType: "Regular",
                  slotType: "Regular",
                  storeNumber: "3132",
                  paymentType: "Credit Card",
                  bagPreference: "Yes",
                  quantity: "1",
                  storeSettings: "Regular",
                })
                setError("")
              }}
            >
              <option value="">Choose a test scenario</option>
              {scenarios.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          {isCustom && (
            <>
              {select("userType", "User Type*", [
                "Regular",
                "FreshPass",
                "Business",
              ])}
              {select("deliveryType", "Delivery Type", ["DUG", "3PL"], true)}
              {select("slotType", "Slot Type", [
                "Regular",
                "Premium",
                "Doordash",
                "Express",
                "Flash",
              ])}
              {select("storeNumber", "Store Number", ["3132", "1502"])}
              {select(
                "itemType",
                "Item Type",
                [
                  "Regular Items",
                  "MTO Items",
                  "Priced Items",
                  "Weighted Items",
                ],
                true,
              )}
              {select("quantity", "Quantity", ["1", "2", "3", "4", "5"], true)}
              {select("paymentType", "Payment Type", ["Credit Card"])}
              {select("bagPreference", "Bag Preference", ["Yes", "No"])}
            </>
          )}
          {isSample &&
            select("sampleOrderType", "Order Type", ["DUG", "Delivery"], true)}
          {isOrder && input("orderNumber", "Order Number", true)}
          {scenario === scenarios[4] &&
            select(
              "cancelledBy",
              "Cancelled By",
              ["Customer", "Acupick/Store"],
              true,
            )}
          {isStore && select("storeNumber", "Store Number", ["3132", "1502"])}
          {isDcp &&
            select(
              "dcpEnvironment",
              "Target Environment",
              ["QA2", "Prod"],
              true,
            )}
          {(isCustom || isSample) && (
            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={() => setAdvanced((old) => !old)}
                aria-expanded={advanced}
                className="text-[12px] font-bold text-[#00539B] hover:underline"
              >
                {advanced ? "▾" : "▸"} Advanced options (optional)
              </button>
              {advanced && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {isCustom && (
                    <>
                      {input("individualItemType", "Individual Item Type")}
                      {select("storageZone", "Storage Zone", [
                        "AM",
                        "FZ",
                        "HT",
                        "CH",
                      ])}
                      {select("storeSettings", "Store Settings", [
                        "Regular",
                        "Rolling Picklist",
                        "Dynamic Batching",
                        "Sector Batching",
                        "Tote label preprinting",
                        "Rolling Picklist + Tote label Preprinting",
                        "Sector Batching + Tote label Preprinting",
                        "Dynamic Batching + Tote label Preprinting",
                      ])}
                    </>
                  )}
                  {input("userEmail", "Test User Email", false, "email")}
                  <p className="text-[11px] text-[#667085] sm:col-span-2">
                    Passwords and other secrets should be provided through a
                    secure backend integration, not stored in request history.
                  </p>
                </div>
              )}
            </div>
          )}
          {error && (
            <p
              role="alert"
              className="rounded-lg bg-[#FFF1F0] p-3 text-[12px] text-[#A12622] sm:col-span-2"
            >
              {error}
            </p>
          )}
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-[#E9EDF1] bg-[#FBFCFD] px-6 py-5">
          {" "}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setScenario("")
                setValues({})
                setError("")
              }}
              className="rounded-lg border border-[#DDE3E9] bg-white px-4 py-2 text-[12px] font-semibold text-[#34445C]"
            >
              Reset
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#003B70] px-4 py-2 text-[12px] font-bold text-white hover:bg-[#00539B]"
            >
              Submit Request
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

const demoOrderNumbers = new Map<string, string>()

const getDemoOrderNumber = (requestId: string) => {
  if (!demoOrderNumbers.has(requestId)) {
    demoOrderNumbers.set(
      requestId,
      String(Math.floor(10000000 + Math.random() * 90000000)),
    )
  }

  return demoOrderNumbers.get(requestId)!
}

function RequestCenterSection2({
  onOpenOnboarding,
  onOpenOtherRequests,
  onOpenRequestHistory,
}: {
  onOpenOnboarding: () => void
  onOpenOtherRequests: () => void
  onOpenRequestHistory: () => void
}) {
  type Page = "home" | "Add Project" | "Revoke Access"

  const [page, setPage] = useState<Page>("home")
  const [submissionSuccess, setSubmissionSuccess] = useState("")
  const [historyExpanded, setHistoryExpanded] = useState(true)
  const [workflowExpanded, setWorkflowExpanded] = useState(false)
  const [requestCenterLayout, setRequestCenterLayout] = useState<"v1" | "v3">(
    "v1",
  )
  const [showAccessTakeover, setShowAccessTakeover] = useState(false)
  const [showNoAccessWelcome, setShowNoAccessWelcome] = useState(false)
  const [dontShowWelcomeAgain, setDontShowWelcomeAgain] = useState(false)
  const welcomeCloseRef = useRef<HTMLButtonElement>(null)
  const welcomeTriggerRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (!showNoAccessWelcome) return
    const previousFocus = document.activeElement as HTMLElement | null
    welcomeCloseRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowNoAccessWelcome(false)
      if (event.key !== "Tab") return
      const dialog = document.getElementById("atlas-no-access-dialog")
      const controls = Array.from(
        dialog?.querySelectorAll<HTMLButtonElement>("button:not([disabled])") ??
          [],
      )
      if (!controls.length) return
      const first = controls[0],
        last = controls[controls.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document
        .removeEventListener(
          "keydown",
          onKeyDown,
        )(welcomeTriggerRef.current ?? previousFocus)
        ?.focus?.()
    }
  }, [showNoAccessWelcome])
  const [selectedRequest, setSelectedRequest] = useState<RequestRecord | null>(
    null,
  )
  const [form, setForm] = useState<ProjectFormData>({
    ...emptyProjectForm,
  })

  const [requests, setRequests] = useState<RequestRecord[]>(() => {
    const demoRequests: RequestRecord[] = [
      {
        id: "REQ-1043",
        type: "Add Project",
        environment: "Fulfillment",
        status: "Failed",
        submitted: "Oct 8, 2026",
        details: "New automation project onboarding",
      },
      {
        id: "REQ-1042",
        type: "Add Project",
        environment: "Fulfillment",
        status: "Completed",
        submitted: "Oct 8, 2026",
        details: "New automation project onboarding",
      },
      {
        id: "REQ-1041",
        type: "Request Access",
        environment: "AccuPick",
        status: "In Progress",
        submitted: "Oct 7, 2026",
        details: "Project execution access",
      },
      {
        id: "REQ-1040",
        type: "Create a customized test order",
        environment: "DUG",
        status: "Submitted",
        submitted: "Oct 6, 2026",
        details: "Remove project membership",
      },
    ]
    try {
      const saved = window.localStorage.getItem(
        "atlas360-request-center-requests",
      )
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) return parsed as RequestRecord[]
      }
    } catch {
      // Use demo requests when storage is unavailable.
    }
    return demoRequests
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(
        "atlas360-request-center-requests",
        JSON.stringify(requests),
      )
    } catch {
      // Continue using in-memory history if storage is unavailable.
    }
  }, [requests])

  const update = (field: keyof ProjectFormData, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const resetForm = () => setForm({ ...emptyProjectForm })

  const createRequest = (
    type: RequestType,
    project: string,
    details: string,
  ) => {
    const nextNumber =
      Math.max(1042, ...requests.map((r) => Number(r.id.split("-")[1]))) + 1

    const record: RequestRecord = {
      id: `REQ-${nextNumber}`,
      type,
      project,
      status: "Submitted",
      submitted: new Date().toLocaleDateString(),
      details,
    }

    setRequests((current) => [record, ...current])
    setSelectedRequest(record)

    setSubmissionSuccess(`Request ${record.id} submitted successfully.`)

    return record.id
  }

  const handleProjectSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const type: RequestType =
      page === "Add Project" ? "Add Project" : "Revoke Access"

    const details =
      type === "Add Project"
        ? [
            `Owner: ${form.ownerEmail}`,
            `Description: ${form.description}`,
            `Type: ${form.projectType}`,
            `Framework: ${form.framework}`,
            `Environment: ${form.environment}`,
            `Repository: ${form.repository}`,
            `GitHub Actions: ${form.needsCI}`,
            form.needsCI === "Yes"
              ? `Workflow: ${form.workflowName} (${form.branch})`
              : "",
          ]
            .filter(Boolean)
            .join(" | ")
        : `User: ${form.userEmail} | Reason: ${form.reason}`

    createRequest(type, form.projectName, details)
    setPage("home")
    resetForm()
  }

  const handleAccessSubmit = (data: AccessFormData) => {
    const details = [
      `User: ${data.userEmail}`,
      `Access Level: ${data.accessLevel}`,
      `Duration: ${data.accessDuration}`,
      data.accessDuration === "Temporary"
        ? `End Date: ${data.accessEndDate}`
        : "",
      `Reason: ${data.reason}`,
    ]
      .filter(Boolean)
      .join(" | ")

    createRequest("Request Access", data.projectName, details)
    setShowAccessTakeover(false)
  }

  const actions = [
    {
      title: "Add Project",
      description: "Onboard a new project to the automation platform",
      icon: "＋",
      onClick: () => {
        setSubmissionSuccess("")
        resetForm()
        setPage("Add Project")
      },
    },
    {
      title: "Request Access to Automation Project",
      description: "Request access to an existing automation project",
      icon: "↗",
      onClick: () => {
        setSubmissionSuccess("")
        setShowAccessTakeover(true)
      },
    },
    {
      title: "Revoke User from Project",
      description: "Remove a user's access to an automation project",
      icon: "−",
      onClick: () => {
        setSubmissionSuccess("")
        resetForm()
        setPage("Revoke Access")
      },
    },
  ]

  // Replace these with actual workflow portal links.

  const workflows = [
    {
      title: "Regression Execution",
      description: "Request a regression execution",
      url: "https://your-domain.com/regression",
    },
    {
      title: "Test Data Request",
      description: "Request test data",
      url: "https://your-domain.com/test-data",
    },
    {
      title: "Store Configuration",
      description: "Request store configuration support",
      url: "https://your-domain.com/store-configuration",
    },
    {
      title: "Environment Support",
      description: "Request environment support",
      url: "https://your-domain.com/environment",
    },
  ]

  // =====================================================
  // FULL-SCREEN ACCESS TAKEOVER
  // =====================================================

  if (showAccessTakeover) {
    return (
      <RequestAccessTakeover
        onClose={() => setShowAccessTakeover(false)}
        onSubmit={handleAccessSubmit}
      />
    )
  }

  // =====================================================
  // FULL-PAGE ADD PROJECT / REVOKE ACCESS
  // =====================================================

  if (page !== "home") {
    const isAddProject = page === "Add Project"

    return (
      <div className="min-h-[75vh] pb-12">
        <button
          type="button"
          onClick={() => {
            setPage("home")
            resetForm()
          }}
          className="mb-6 inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#003B70] transition-colors hover:bg-[#E8F0F7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00539B]"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
        </button>

        <div className="mb-7">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#778198]">
            Request Center / New Request
          </p>

          <h1 className="mt-2 text-[28px] font-bold tracking-[-0.035em] text-[#13203D] sm:text-[34px]">
            {isAddProject ? "Add Project" : "Revoke User from Project"}
          </h1>

          <p className="mt-2 text-[13px] text-[#667085]">
            {isAddProject
              ? "Configure and onboard a new automation project."
              : "Submit a request to remove project access."}
          </p>
        </div>

        <form
          onSubmit={handleProjectSubmit}
          className="max-w-[1000px] overflow-hidden rounded-xl border border-[#DDE3E9] bg-white shadow-sm"
        >
          <div className="border-b border-[#E9EDF1] px-6 py-5">
            <h2 className="text-[17px] font-bold text-[#17233D]">
              {isAddProject
                ? "Project Configuration"
                : "Access Revocation Details"}
            </h2>
          </div>

          <div className="grid gap-5 p-6 sm:grid-cols-2">
            {isAddProject ? (
              <>
                <label className={requestLabelClass}>
                  Project Name *
                  <input
                    required
                    value={form.projectName}
                    onChange={(e) => update("projectName", e.target.value)}
                    placeholder="Enter project name"
                    className={requestFieldClass}
                  />
                </label>

                <label className={requestLabelClass}>
                  Project Owner Email *
                  <input
                    required
                    type="email"
                    value={form.ownerEmail}
                    onChange={(e) => update("ownerEmail", e.target.value)}
                    placeholder="owner@company.com"
                    className={requestFieldClass}
                  />
                </label>

                <label className={`${requestLabelClass} sm:col-span-2`}>
                  Project Description *
                  <textarea
                    required
                    rows={3}
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    placeholder="Describe the project and automation requirements"
                    className={requestFieldClass}
                  />
                </label>

                <label className={requestLabelClass}>
                  Project Type *
                  <select
                    required
                    value={form.projectType}
                    onChange={(e) => update("projectType", e.target.value)}
                    className={requestFieldClass}
                  >
                    <option value="">Select project type</option>
                    <option value="UI Automation">UI Automation</option>
                    <option value="API Automation">API Automation</option>
                    <option value="UI + API">UI + API</option>
                    <option value="Other">Other</option>
                  </select>
                </label>

                <label className={requestLabelClass}>
                  Automation Framework *
                  <select
                    required
                    value={form.framework}
                    onChange={(e) => update("framework", e.target.value)}
                    className={requestFieldClass}
                  >
                    <option value="">Select framework</option>
                    <option>Playwright</option>
                    <option>Cypress</option>
                    <option>Selenium</option>
                    <option>Postman / Newman</option>
                    <option>Other</option>
                  </select>
                </label>

                {(form.projectType === "UI Automation" ||
                  form.projectType === "UI + API") && (
                  <div className="rounded-lg border border-[#DCE8F3] bg-[#F7FAFD] p-5 sm:col-span-2">
                    <h3 className="mb-4 text-[13px] font-bold text-[#003B70]">
                      UI Automation Configuration
                    </h3>

                    <label className={requestLabelClass}>
                      Application URL *
                      <input
                        required
                        type="url"
                        value={form.applicationUrl}
                        onChange={(e) =>
                          update("applicationUrl", e.target.value)
                        }
                        placeholder="https://application.example.com"
                        className={requestFieldClass}
                      />
                    </label>
                  </div>
                )}

                {(form.projectType === "API Automation" ||
                  form.projectType === "UI + API") && (
                  <div className="rounded-lg border border-[#DCE8F3] bg-[#F7FAFD] p-5 sm:col-span-2">
                    <h3 className="mb-4 text-[13px] font-bold text-[#003B70]">
                      API Automation Configuration
                    </h3>

                    <label className={requestLabelClass}>
                      API Base URL *
                      <input
                        required
                        type="url"
                        value={form.apiBaseUrl}
                        onChange={(e) => update("apiBaseUrl", e.target.value)}
                        placeholder="https://api.example.com"
                        className={requestFieldClass}
                      />
                    </label>
                  </div>
                )}

                {form.projectType === "Other" && (
                  <label className={`${requestLabelClass} sm:col-span-2`}>
                    Describe Automation Type *
                    <textarea
                      required
                      rows={3}
                      value={form.otherAutomationType}
                      onChange={(e) =>
                        update("otherAutomationType", e.target.value)
                      }
                      className={requestFieldClass}
                    />
                  </label>
                )}

                <label className={requestLabelClass}>
                  Repository URL *
                  <input
                    required
                    type="url"
                    value={form.repository}
                    onChange={(e) => update("repository", e.target.value)}
                    placeholder="https://github.com/..."
                    className={requestFieldClass}
                  />
                </label>

                <label className={requestLabelClass}>
                  Target Environment *
                  <select
                    required
                    value={form.environment}
                    onChange={(e) => update("environment", e.target.value)}
                    className={requestFieldClass}
                  >
                    <option value="">Select environment</option>
                    <option>QA</option>
                    <option>Stage</option>
                    <option>Production</option>
                    <option>Multiple Environments</option>
                  </select>
                </label>

                <label className={`${requestLabelClass} sm:col-span-2`}>
                  GitHub Actions Integration *
                  <select
                    required
                    value={form.needsCI}
                    onChange={(e) => update("needsCI", e.target.value)}
                    className={requestFieldClass}
                  >
                    <option value="">Select an option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </label>

                {form.needsCI === "Yes" && (
                  <div className="grid gap-5 rounded-lg border border-[#DCE8F3] bg-[#F7FAFD] p-5 sm:col-span-2 sm:grid-cols-2">
                    <h3 className="text-[13px] font-bold text-[#003B70] sm:col-span-2">
                      GitHub Actions Configuration
                    </h3>

                    <label className={requestLabelClass}>
                      Workflow File *
                      <input
                        required
                        value={form.workflowName}
                        onChange={(e) => update("workflowName", e.target.value)}
                        placeholder="regression.yml"
                        className={requestFieldClass}
                      />
                    </label>

                    <label className={requestLabelClass}>
                      Branch *
                      <input
                        required
                        value={form.branch}
                        onChange={(e) => update("branch", e.target.value)}
                        placeholder="main"
                        className={requestFieldClass}
                      />
                    </label>

                    <label className={`${requestLabelClass} sm:col-span-2`}>
                      Execution Schedule
                      <select
                        value={form.schedule}
                        onChange={(e) => update("schedule", e.target.value)}
                        className={requestFieldClass}
                      >
                        <option value="">Select schedule</option>
                        <option>On Demand</option>
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>On Every Deployment</option>
                      </select>
                    </label>
                  </div>
                )}
              </>
            ) : (
              <>
                <label className={requestLabelClass}>
                  Automation Project *
                  <select
                    required
                    value={form.projectName}
                    onChange={(e) => update("projectName", e.target.value)}
                    className={requestFieldClass}
                  >
                    <option value="">Select project</option>
                    <option>Fulfillment</option>
                    <option>AccuPick</option>
                    <option>DOMS</option>
                    <option>DCP</option>
                    <option>Enterprise Item</option>
                  </select>
                </label>

                <label className={requestLabelClass}>
                  User Email *
                  <input
                    required
                    type="email"
                    value={form.userEmail}
                    onChange={(e) => update("userEmail", e.target.value)}
                    placeholder="user@company.com"
                    className={requestFieldClass}
                  />
                </label>

                <label className={`${requestLabelClass} sm:col-span-2`}>
                  Business Justification *
                  <textarea
                    required
                    rows={4}
                    value={form.reason}
                    onChange={(e) => update("reason", e.target.value)}
                    placeholder="Explain why access should be revoked"
                    className={requestFieldClass}
                  />
                </label>
              </>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t border-[#E9EDF1] bg-[#FBFCFD] px-6 py-5">
            <button
              type="button"
              onClick={() => {
                setPage("home")
                resetForm()
              }}
              className={requestSecondaryButton}
            >
              Cancel
            </button>

            <button type="submit" className={requestPrimaryButton}>
              Submit Request
            </button>
          </div>
        </form>
      </div>
    )
  }

  // =====================================================
  // REQUEST CENTER DASHBOARD
  // =====================================================

  return (
    <div className="pb-10">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex w-full flex-wrap items-center gap-3">
            {" "}
            <h1 className="text-[28px] font-bold text-[#17233D] sm:text-[34px]">
              Request Center
            </h1>
            {submissionSuccess && (
              <span
                role="status"
                aria-live="polite"
                className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-[#E8F5EE] px-3 py-1.5 text-[12px] font-semibold text-[#16765B]"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m8 12 2.5 2.5L16 9" />
                </svg>

                {submissionSuccess}
              </span>
            )}
          </div>

          <div className="mt-2 flex w-full items-center justify-between gap-4">
            <p className="min-w-0 text-[13px] text-[#667085]">
              Manage project onboarding, access, and workflow test requests.
            </p>

            <button
              type="button"
              onClick={(event) => {
                welcomeTriggerRef.current = event.currentTarget
                setShowNoAccessWelcome(true)
              }}
              className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-[#B8CADB] bg-white px-3 py-2 text-[12px] font-semibold text-[#00539B] transition-colors hover:border-[#00539B] hover:bg-[#E8F0F7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00539B]"
            >
              Welcome
            </button>
          </div>
        </div>
      </div>

      {requestCenterLayout === "v3" && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#D5E2ED] bg-[#E8F0F7] px-5 py-4">
          <div>
            <p className="text-[13px] font-bold text-[#003B70]">
              Access required — design preview
            </p>
            <p className="mt-1 text-[12px] text-[#526174]">
              Users can explore ATLAS360. Running automation requires the
              appropriate project permissions.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowNoAccessWelcome(true)}
            className={requestSecondaryButton}
          >
            View welcome message
          </button>
        </div>
      )}

      {requestCenterLayout === "v1" && (
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,70fr)_minmax(0,30fr)]">
          {/* Main: always-visible request configuration */}
          <section
            className="min-w-0 overflow-hidden rounded-xl border border-[#DDE3E9] bg-white shadow-sm"
            aria-label="Request Configuration"
          >
            <WorkflowTestForm
              onSubmit={(scenario, details) => {
                return createRequest("Workflow Test", scenario, details)
              }}
            />
            {/* Other Requests CTA — aligned card footer */}
            <div className="border-t border-[#E8EDF2] bg-white px-6 py-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-[#17233D]">
                    Need something else?
                  </p>
                  <p className="mt-1 text-[12px] leading-5 text-[#526174]">
                    Have a request that isn't listed above?{" "}
                    <button
                      type="button"
                      onClick={onOpenOtherRequests}
                      className="inline-flex shrink-0 items-center gap-1.5 self-start whitespace-nowrap rounded-sm p-0 text-[12px] font-bold text-[#00539B] transition hover:text-[#003B70] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00539B] sm:self-center"
                    >
                      Submit an additional request
                    </button>{" "}
                    for the team to review.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Compact history: no accordion; order number only in Details */}

          <section
            className="min-w-0 overflow-hidden rounded-xl border border-[#DDE3E9] bg-white shadow-sm"
            aria-label="Request History"
          >
            {/* Request History Header */}
            <div className="flex items-center justify-between border-b border-[#E9EDF1] px-4 py-4">
              <h2 className="text-[16px] font-bold text-[#17233D]">
                Request History
              </h2>

              <span className="ml-3 mr-auto rounded-full bg-[#E8F0F7] px-2.5 py-1 text-[11px] font-semibold text-[#003B70]">
                {requests.length}
              </span>
            </div>

            {/* Request History Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[320px] text-left text-[12px]">
                <thead className="bg-[#F8FAFC] text-[11px] text-[#526174]">
                  <tr>
                    <th scope="col" className="py-3 pl-5 pr-3 font-semibold">
                      Request Number
                    </th>

                    <th scope="col" className="px-3 py-3 font-semibold">
                      Status
                    </th>

                    <th scope="col" className="py-3 pl-3 pr-5 font-semibold">
                      Details
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E9EDF1]">
                  {requests.slice(0, 8).map((request) => {
                    const orderNumber = getDemoOrderNumber(String(request.id))

                    return (
                      <tr key={request.id} className="hover:bg-[#F8FAFC]">
                        {/* Request Number */}
                        <td className="py-3 pl-5 pr-3">
                          <button
                            type="button"
                            onClick={() => setSelectedRequest(request)}
                            className="font-semibold text-[#00539B] hover:underline"
                          >
                            {request.id}
                          </button>
                        </td>

                        {/* Status */}
                        <td className="px-3 py-3">
                          <span
                            className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                              request.status === "Completed"
                                ? "bg-[#EAF7F2] text-[#16765B]"
                                : request.status === "In Progress"
                                  ? "bg-[#E8F0F7] text-[#003B70]"
                                  : request.status === "Failed"
                                    ? "bg-[#FDECEC] text-[#B42318]"
                                    : "bg-[#FFF5E3] text-[#926412]"
                            }`}
                          >
                            {request.status}
                          </span>
                        </td>

                        {/* Details */}
                        <td className="py-3 pl-3 pr-5 text-[#526174]">
                          {orderNumber}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {requests.length > 8 && (
              <div className="flex justify-center border-t border-[#E9EDF1] px-4 py-3">
                <button
                  type="button"
                  onClick={onOpenRequestHistory}
                  className="text-[12px] font-semibold text-[#00539B] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00539B]"
                >
                  View More →
                </button>
              </div>
            )}
          </section>
        </div>
      )}

      {/* Legacy inline workflow accordion retained for V2/V3 only */}
      {requestCenterLayout === "v3" && (
        <section className="mt-6 overflow-hidden rounded-xl border border-[#DDE3E9] bg-white shadow-sm">
          <h2>
            <button
              type="button"
              onClick={() => setWorkflowExpanded((current) => !current)}
              aria-expanded={workflowExpanded}
              aria-controls="workflow-test-form-content"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-[#F8FAFC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#003B70]"
            >
              <span className="flex items-center gap-3">
                <span
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#E8F0F7] text-[#003B70]"
                  aria-hidden="true"
                >
                  ⚙
                </span>
                <span>
                  <span className="block text-[14px] font-bold text-[#17233D]">
                    Workflow Test Request
                  </span>
                  <span className="mt-1 block text-[12px] text-[#667085]">
                    Create, fulfil, cancel, or validate test orders
                  </span>
                </span>
              </span>
              <span aria-hidden="true" className="text-[#526174]">
                {workflowExpanded ? "⌃" : "⌄"}
              </span>
            </button>
          </h2>
          <div id="workflow-test-form-content" hidden={!workflowExpanded}>
            <WorkflowTestForm
              onSubmit={(scenario, details) => {
                createRequest("Workflow Test", scenario, details)
                setHistoryExpanded(true)
                setWorkflowExpanded(false)
              }}
            />
          </div>
        </section>
      )}

      {/* V3 access-restricted welcome preview. This does not implement authorization. */}

      {showNoAccessWelcome && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-[#0F172A]/50 p-4 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget)
              setShowNoAccessWelcome(false)
          }}
        >
          <div
            id="atlas-no-access-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="atlas-no-access-title"
            aria-describedby="atlas-no-access-desc"
            className="relative w-full max-w-[550px] overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* Welcome confetti animation */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-2xl"
            >
              {Array.from({ length: 36 }, (_, i) => {
                const colors = [
                  "#FFFFFF",
                  "#FFD166",
                  "#60A5FA",
                  "#93C5FD",
                  "#F472B6",
                  "#34D399",
                ]

                return (
                  <span
                    key={i}
                    className="atlas-confetti"
                    style={
                      {
                        "--left": `${(i * 37 + 11) % 100}%`,
                        "--drift": `${((i * 53) % 180) - 90}px`,
                        "--rotation": `${360 + (i % 4) * 180}deg`,
                        "--delay": `${(i % 9) * 0.08}s`,
                        "--color": colors[i % colors.length],
                      } as React.CSSProperties
                    }
                  />
                )
              })}
            </div>

            {/* Welcome header */}
            <div className="relative flex items-center gap-4 bg-gradient-to-r from-[#2455DB] to-[#5485FA] px-7 py-6 text-white sm:px-8">
              {" "}
              <span className="shrink-0 text-[43px]" aria-hidden="true">
                🎉
              </span>
              <div className="min-w-0 pr-10">
                <h2
                  id="atlas-no-access-title"
                  className="text-[24px] font-bold leading-tight sm:text-[26px]"
                >
                  Welcome to ATLAS360
                </h2>

                <p id="atlas-no-access-desc" className="sr-only">
                  Explore the features available in ATLAS360.
                </p>
              </div>
              {/* Existing close button */}
              <button
                ref={welcomeCloseRef}
                type="button"
                aria-label="Close welcome dialog"
                onClick={() => setShowNoAccessWelcome(false)}
                className="atlas-dialog-close atlas-dialog-close--light"
              >
                ×
              </button>
            </div>

            {/* Dialog content */}
            <div className="p-5 sm:p-6">
              {" "}
              {/* Feature tiles */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  {
                    id: "request",
                    title: "Request Center",
                    description: "Raise and track your requests in one place.",
                  },
                  {
                    id: "store",
                    title: "Store Lookup",
                    description: "Find store details quickly.",
                  },
                  {
                    id: "automation",
                    title: "Automation Tests",
                    description: "Run automation tests on your own, on demand.",
                  },
                  {
                    id: "insights",
                    title: "Environment Insights",
                    description:
                      "See the health and status of your environments.",
                  },
                ].map((tile) => (
                  <div
                    key={tile.id}
                    className="flex min-h-[125px] flex-col items-center rounded-xl border border-[#DFE5F1] bg-white px-4 py-3.5 text-center"
                  >
                    {/* Feature icon */}
                    <span
                      className="mb-2 flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#2455DB] text-white"
                      aria-hidden="true"
                    >
                      {tile.id === "request" && (
                        <svg
                          width="23"
                          height="23"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 5h14v11H9l-4 4V5Z" />
                          <path d="M9 9h6M9 12h4" />
                        </svg>
                      )}

                      {tile.id === "store" && (
                        <svg
                          width="23"
                          height="23"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 10 5 4h14l2 6v2H3v-2Z" />
                          <path d="M5 12v8h14v-8M9 20v-6h6v6" />
                        </svg>
                      )}

                      {tile.id === "automation" && (
                        <svg
                          width="23"
                          height="23"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m7 4 13 8-13 8V4Z" />
                        </svg>
                      )}

                      {tile.id === "insights" && (
                        <svg
                          width="23"
                          height="23"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 20h16M7 16v-4M12 16V8M17 16V4" />
                        </svg>
                      )}
                    </span>

                    <h3 className="text-[15px] font-bold text-[#17233D]">
                      {tile.title}
                    </h3>

                    <p className="mt-1 text-[12px] leading-[18px] text-[#526174]">
                      {" "}
                      {tile.description}
                    </p>
                  </div>
                ))}
              </div>
              {/* Dialog footer */}
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {" "}
                <label className="inline-flex cursor-pointer items-center gap-2.5 text-[13px] text-[#526174]">
                  <input
                    type="checkbox"
                    checked={dontShowWelcomeAgain}
                    onChange={(event) =>
                      setDontShowWelcomeAgain(event.target.checked)
                    }
                    className="size-4 cursor-pointer accent-[#2455DB]"
                  />
                  Don't show again
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowNoAccessWelcome(false)
                    onOpenOnboarding()
                  }}
                  className="inline-flex items-center justify-center rounded-lg bg-[#2455DB] px-6 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-[#1745C5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2455DB]"
                >
                  Get started
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Request Details Dialog - main*/}
      {selectedRequest && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#0B223D]/60 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="request-detail-title"
            className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl"
          >
            <div className="atlas-modal-header">
              {" "}
              <h2
                id="request-detail-title"
                className="text-xl font-bold text-white"
              >
                {selectedRequest.id}
              </h2>
              <button
                type="button"
                aria-label="Close request details"
                onClick={() => setSelectedRequest(null)}
                className="atlas-dialog-close atlas-dialog-close--light"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <dl className="grid grid-cols-2 gap-5 text-[13px]">
                {" "}
                {[
                  ["Request Type", selectedRequest.type],
                  ["Status", selectedRequest.status],
                  ["Environment", selectedRequest.environment],
                  ["Submitted", selectedRequest.submitted],
                  [
                    "Order Number",
                    getDemoOrderNumber(String(selectedRequest.id)),
                  ],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-[#8791A0]">{label}</dt>
                    <dd className="mt-1 font-semibold text-[#17233D]">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className={requestPrimaryButton}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
/* =========================================
   STORE LOOKUP TAB
========================================= */

const storeClusterData = [
  {
    cluster: "West",
    storeNo: "1507",
    banner: "Safeway",
    address: "2020 Market Street, San Francisco, CA",
    zipCode: "94114",
  },
  {
    cluster: "West",
    storeNo: "1930",
    banner: "Safeway",
    address: "8071 Guide Meridian Road #101, Lynden WA",
    zipCode: "98264",
  },
  {
    cluster: "East",
    storeNo: "4500",
    banner: "Jewel-Osco",
    address: "1340 S Canal Street, Chicago, IL",
    zipCode: "60607",
  },
  {
    cluster: "East",
    storeNo: "3441",
    banner: "Jewel-Osco",
    address: "2707 E Division St, Dimond, IL",
    zipCode: "60657",
  },
  {
    cluster: "East",
    storeNo: "3745",
    banner: "Jewel-Osco",
    address: "2707 E Division St, Dimond, IL",
    zipCode: "60416",
  },
  {
    cluster: "Canary",
    storeNo: "182",
    banner: "Albertsons",
    address: "250 S Eagle Rd, Eagle, ID",
    zipCode: "83616",
  },
  {
    cluster: "Canary",
    storeNo: "625",
    banner: "Shaws",
    address: "8 Chapel View Blvd, Cranston, RI",
    zipCode: "02920",
  },
  {
    cluster: "Canary",
    storeNo: "1296",
    banner: "Jewel-Osco",
    address: "7342 W Foster Ave, Chicago, IL",
    zipCode: "60656",
  },
]

function StoreClusterReferenceTable() {
  return (
    <section className="mx-auto mt-8 w-[80%] overflow-hidden rounded-xl border border-[#DDE3E9] bg-white shadow-sm">
      {" "}
      <div className="flex items-center justify-between border-b border-[#E9EDF1] px-5 py-4">
        <div>
          <h2 className="text-[17px] font-bold text-[#13203D]">
            Production stores for test orders
          </h2>
        </div>

        <span className="rounded-full bg-[#E8F0F7] px-3 py-1 text-[11px] font-semibold text-[#003B70]">
          {storeClusterData.length} Stores
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead className="bg-[#F4F6F8]">
            <tr>
              {[
                "Cluster",
                "Store No",
                "Banner",
                "Store Address",
                "ZIP Code",
              ].map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className="border-b border-[#E9EDF1] px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-[#526174]"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {storeClusterData.map((store, index) => {
              const isFirstInCluster =
                index === 0 ||
                storeClusterData[index - 1].cluster !== store.cluster

              const clusterRowCount = isFirstInCluster
                ? storeClusterData.filter(
                    (item) => item.cluster === store.cluster,
                  ).length
                : 0

              // NEW: Identify the last store in each cluster
              const isLastInCluster =
                index === storeClusterData.length - 1 ||
                storeClusterData[index + 1].cluster !== store.cluster

              return (
                <tr
                  key={`${store.cluster}-${store.storeNo}`}
                  className={`border-b ${
                    isLastInCluster
                      ? "border-b-2 border-[#CBD5E1]"
                      : "border-[#EEF1F4]"
                  }`}
                >
                  {isFirstInCluster && (
                    <th
                      scope="rowgroup"
                      rowSpan={clusterRowCount}
                      className="border-r border-r-[#E9EDF1] border-b-2 border-b-[#CBD5E1] bg-[#EDF2F6] px-5 py-3 text-center align-middle"
                    >
                      <span className="text-[12px] font-bold text-[#003B70]">
                        {store.cluster}
                      </span>
                    </th>
                  )}

                  <td className="px-5 py-3 text-[12px] font-semibold text-[#26324C]">
                    {store.storeNo}
                  </td>

                  <td className="px-5 py-3 text-[12px] text-[#526174]">
                    {store.banner}
                  </td>

                  <td className="px-5 py-3 text-[12px] text-[#526174]">
                    {store.address}
                  </td>

                  <td className="px-5 py-3 text-[12px] text-[#526174]">
                    {store.zipCode}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

type GrafanaPod = {
  id: string
  name: string
  url: string
}

type GrafanaProject = {
  id: string
  name: string
  pods: GrafanaPod[]
}

// Replace these examples with your actual projects, PODs and URLs.
const grafanaProjects: GrafanaProject[] = [
  {
    id: "fulfillment",
    name: "Fulfillment",
    pods: [
      { id: "order", name: "Order Management", url: "" },
      { id: "slot", name: "Slot Promise", url: "" },
      { id: "accupick", name: "AccuPick", url: "" },
      { id: "tpl", name: "TPL Integrations", url: "" },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise Item",
    pods: [
      { id: "item", name: "Item Services", url: "" },
      { id: "catalog", name: "Catalog", url: "" },
    ],
  },
  {
    id: "retail",
    name: "Retail Operations",
    pods: [{ id: "store", name: "Store Operations", url: "" }],
  },
]

//Environment Insights page

// Replace your existing GrafanaDashboardsSection function with this component.
// Uses the useState import already present in App.tsx.
function GrafanaDashboardsSection({
  onOpenServiceList,
}: {
  onOpenServiceList: () => void
}) {
  type Service = {
    name: string
    cluster: string
    imageVersion: string
    startedAt: string
  }
  type Namespace = {
    id: string
    name: string
    dashboardUrl?: string
    services: Service[]
  }
  type Environment = "QA2" | "Prod"

  const serviceNames = [
    "Auth Service",
    "Cart API",
    "Checkout API",
    "Order API",
    "Slot Promise API",
    "AccuPick",
    "TPL Webhooks",
    "Inventory Service",
    "Pricing API",
    "Catalog Service",
    "Fulfillment API",
    "Batching Service",
  ]
  // Demo-only records: replace with environment API response later.
  const demoData: Record<Environment, Namespace[]> = {
    QA2: [
      {
        id: "ospk",
        name: "OSPK",
        dashboardUrl: "https://your-grafana-url/qa2/ospk",

        services: serviceNames.map((name, index) => ({
          name,
          cluster: index % 2 === 0 ? "qa2-east-01" : "qa2-west-01",
          imageVersion: `${name.toLowerCase().replace(/\s+/g, "-")}:${
            index % 2 === 0
              ? `master-aks-native-${337 + index}`
              : `26.10.02-${112 + index}`
          }`,
          startedAt: new Date(
            2026,
            9,
            18 - (index % 7),
            9 + (index % 8),
            (index * 7) % 60,
          ).toISOString(),
        })),
      },
      {
        id: "retail",
        name: "RETAIL",
        dashboardUrl: "https://your-grafana-url/qa2/retail",

        services: [
          {
            name: "Store Lookup API",
            cluster: "qa2-east-01",
            imageVersion: "v1.8.2",
            startedAt: "2026-10-18T08:25:00",
          },
          {
            name: "Item Service",
            cluster: "qa2-west-01",
            imageVersion: "v1.5.4",
            startedAt: "2026-10-17T11:10:00",
          },
        ],
      },
    ],
    Prod: [
      {
        id: "ospk",
        name: "OSPK",
        dashboardUrl: "https://your-grafana-url/prod/ospk",

        services: serviceNames.map((name, index) => ({
          name,
          cluster: index % 2 === 0 ? "prod-east-01" : "prod-west-01",
          imageVersion: `${name.toLowerCase().replace(/\s+/g, "-")}:${
            index % 2 === 0
              ? `26.10.02-${112 + index}`
              : `master-aks-native-${337 + index}`
          }`,
          startedAt: new Date(
            2026,
            9,
            14 - (index % 8),
            7 + (index % 8),
            (index * 5) % 60,
          ).toISOString(),
        })),
      },
      {
        id: "retail",
        name: "RETAIL",
        dashboardUrl: "https://your-grafana-url/prod/retail",

        services: [
          {
            name: "Store Lookup API",
            cluster: "prod-east-01",
            imageVersion: "store-lookup-api:26.10.02-112",
            startedAt: "2026-10-11T07:15:00",
          },
          {
            name: "Item Service",
            cluster: "prod-west-01",
            imageVersion: "item-service:master-aks-native-337",
            startedAt: "2026-10-10T12:40:00",
          },
        ],
      },
    ],
  }

  const [environment, setEnvironment] = useState<Environment>("QA2")
  const [search, setSearch] = useState("")
  const [expanded, setExpanded] = useState<string | null>("ospk")
  const query = search.trim().toLowerCase()
  const filtered = demoData[environment]
    .map((namespace) => ({
      ...namespace,
      services:
        query && !namespace.name.toLowerCase().includes(query)
          ? namespace.services.filter((service) =>
              [service.name, service.cluster, service.imageVersion].some(
                (field) => field.toLowerCase().includes(query),
              ),
            )
          : namespace.services,
    }))
    .filter((namespace) => namespace.services.length > 0)
  const visibleExpanded = query
    ? filtered.some((n) => n.id === expanded)
      ? expanded
      : (filtered[0]?.id ?? null)
    : expanded
  const serviceCount = filtered.reduce(
    (total, namespace) => total + namespace.services.length,
    0,
  )
  const formatStarted = (value: string) => {
    const date = new Date(value)
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
    }
  }

  return (
    <div className="space-y-5 pb-8">
      <div>
        <h1 className="text-[28px] font-bold text-[#13203D] sm:text-[34px]">
          Environment Insights
        </h1>
        <p className="mt-2 text-[12px] text-[#69748B]">
          Explore service deployments, clusters, and container versions by
          environment.
        </p>
      </div>

      <section className="overflow-hidden rounded-xl border border-[#DDE3E9] bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-[#E9EDF1] p-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full sm:w-[220px]">
            <label
              htmlFor="insights-environment"
              className="mb-1.5 block text-[12px] font-semibold text-[#34445C]"
            >
              Environment
            </label>
            <select
              id="insights-environment"
              value={environment}
              onChange={(event) => {
                setEnvironment(event.target.value as Environment)
                setExpanded("ospk")
              }}
              className="h-10 w-full rounded-lg border border-[#CBD5E1] bg-white px-3 text-[13px] font-medium text-[#17233D] outline-none focus-visible:ring-2 focus-visible:ring-[#00539B]"
            >
              <option value="QA2">QA2</option>
              <option value="Prod">Prod</option>
            </select>
          </div>
          <div className="relative w-full sm:w-[280px]">
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>

            <input
              type="search"
              value={search}
              placeholder="Search by App Name, or Cluster"
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search services"
              className="h-10 w-full rounded-lg border border-[#DDE3E9] bg-white pl-10 pr-3 text-[12px] text-[#17233D] outline-none transition-colors hover:border-[#9CB6CD] focus:border-[#003B70] focus:ring-2 focus:ring-[#003B70]/15"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
          <p className="text-[12px] text-[#526174]">
            Showing <strong className="text-[#17233D]">{serviceCount}</strong>{" "}
            services across{" "}
            <strong className="text-[#17233D]">{filtered.length}</strong>{" "}
            namespaces in {environment}
          </p>
        </div>

        <div className="space-y-3 px-5 pb-5">
          {filtered.map((namespace) => {
            const isOpen = visibleExpanded === namespace.id
            const panelId = `namespace-${namespace.id}`
            return (
              <section
                key={namespace.id}
                className="overflow-hidden rounded-lg border border-[#DDE3E9]"
              >
                <div
                  className={`flex items-center gap-3 px-4 py-3 ${
                    isOpen ? "bg-[#F1F6FB]" : "bg-white"
                  }`}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() =>
                      setExpanded((current) =>
                        current === namespace.id ? null : namespace.id,
                      )
                    }
                    className="flex min-w-0 flex-1 items-center gap-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00539B] "
                  >
                    <svg
                      className={`size-4 shrink-0 text-[#526174] transition-transform ${
                        isOpen ? "rotate-90" : ""
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                    <span className="min-w-0">
                      <span className="block text-[14px] font-bold text-[#17233D]">
                        {namespace.name}
                      </span>
                      <span className="block text-[11px] text-[#526174]">
                        {namespace.services.length} services · {environment}
                      </span>
                    </span>
                  </button>
                  {namespace.dashboardUrl ? (
                    <a
                      href={namespace.dashboardUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-[12px] font-semibold text-[#00539B] hover:underline"
                    >
                      Go to Grafana Dashboard ↗
                    </a>
                  ) : (
                    <span
                      className="shrink-0 text-[11px] text-[#667085]"
                      title="Add the namespace Grafana URL to enable this link"
                    >
                      Grafana link pending
                    </span>
                  )}
                </div>
                {isOpen && (
                  <div
                    id={panelId}
                    className="overflow-x-auto border-t border-[#DDE3E9]"
                  >
                    <table className="w-full min-w-[690px] text-left text-[12px]">
                      <thead className="bg-[#F8FAFC] text-[11px] text-[#526174]">
                        <tr className="bg-[#F4F8FC] text-[11px] font-bold uppercase tracking-[0.13em] text-[#526174]">
                          <th scope="col" className="px-5 py-3 font-semibold">
                            Service / App Name
                          </th>
                          <th scope="col" className="px-4 py-3 font-semibold">
                            Cluster
                          </th>
                          <th scope="col" className="px-4 py-3 font-semibold">
                            Container Image Version
                          </th>
                          <th scope="col" className="px-4 py-3 font-semibold">
                            Container Start Time
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E9EDF1]">
                        {namespace.services.map((service) => {
                          const started = formatStarted(service.startedAt)
                          return (
                            <tr
                              key={`${namespace.id}-${service.name}`}
                              className="hover:bg-[#F8FAFC]"
                            >
                              <td className="px-5 py-3 font-semibold text-[#17233D]">
                                {service.name}
                              </td>
                              <td className="px-4 py-3 text-[#526174]">
                                {service.cluster}
                              </td>
                              <td className="px-4 py-3">
                                <span className="rounded-md bg-[#E8F0F7] px-2.5 py-1 font-medium text-[#003B70]">
                                  {service.imageVersion}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <HistoryDateTime value={service.startedAt} />
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )
          })}
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-[13px] font-semibold text-[#17233D]">
                No matching services
              </p>
              <p className="mt-1 text-[12px] text-[#526174]">
                Try another search or environment.
              </p>
            </div>
          )}
        </div>
        <div className="border-t border-[#E9EDF1] bg-[#F8FAFC] px-5 py-4 text-center text-[12px] text-[#526174]">
          Not able to find your service?{" "}
          <button
            type="button"
            onClick={onOpenServiceList}
            className="font-semibold text-[#00539B] underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#003B70]"
          >
            View full service list →
          </button>
        </div>
      </section>
    </div>
  )
}

//Store Lookup Page

function StoreLookupSection() {
  type StoreInfo = {
    siteId: string
    cluster: string
    banner: string
    division: string
    street: string
    cityState: string
    zipCode: string
    localTime: string
  }

  type BatchingConfig = {
    environment: string
    dynamicBatch: boolean
    sectorBatch: boolean
    rollingPicklist: boolean
    twm: boolean
    bulkBatching: boolean
    maxOrders: number
    minOrdersToBatch: number
    maxTotes: number
    maxTotesPerOrder: number
    maxSectorTotes: number
    maxSectors: number
  }

  const [environment, setEnvironment] = useState("QA3")
  const [searchBy, setSearchBy] = useState<"store" | "zip">("store")
  const [searchValue, setSearchValue] = useState("1502")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  // Prototype data based on the current portal screenshot.

  const sampleStores: StoreInfo[] = [
    {
      siteId: "1502",
      cluster: "Test",
      banner: "Safeway",
      division: "NO. CALIF",
      street: "2020 Market Street",
      cityState: "San Francisco, CA",
      zipCode: "94114",
      localTime: "11:00 PM PDT",
    },
    {
      siteId: "1507",
      cluster: "West",
      banner: "Safeway",
      division: "NO. CALIF",
      street: "2020 Market Street",
      cityState: "San Francisco, CA",
      zipCode: "94114",
      localTime: "11:00 PM PDT",
    },
    {
      siteId: "1930",
      cluster: "West",
      banner: "Safeway",
      division: "NO. CALIF",
      street: "8071 Guide Meridian Road #101",
      cityState: "Lynden, WA",
      zipCode: "98264",
      localTime: "11:00 PM PDT",
    },
    {
      siteId: "4500",
      cluster: "East",
      banner: "Jewel-Osco",
      division: "NO. CALIF",
      street: "1340 S Canal Street",
      cityState: "Chicago, IL",
      zipCode: "60607",
      localTime: "11:00 PM PDT",
    },
    {
      siteId: "3441",
      cluster: "East",
      banner: "Jewel-Osco",
      division: "NO. CALIF",
      street: "2707 E Division St",
      cityState: "Dimond, IL",
      zipCode: "60657",
      localTime: "11:00 PM PDT",
    },
    {
      siteId: "3745",
      cluster: "East",
      banner: "Jewel-Osco",
      division: "NO. CALIF",
      street: "2707 E Division St",
      cityState: "Dimond, IL",
      zipCode: "60416",
      localTime: "11:00 PM PDT",
    },
    {
      siteId: "182",
      cluster: "Albertsons",
      banner: "Safeway",
      division: "NO. CALIF",
      street: "250 S Eagle Rd",
      cityState: "Eagle, ID",
      zipCode: "83616",
      localTime: "11:00 PM PDT",
    },
    {
      siteId: "625",
      cluster: "Canary",
      banner: "Shaws",
      division: "NO. CALIF",
      street: "8 Chapel View Blvd",
      cityState: "Cranston, RI",
      zipCode: "02920",
      localTime: "11:00 PM PDT",
    },
    {
      siteId: "1296",
      cluster: "Canary",
      banner: "Jewel-Osco",
      division: "NO. CALIF",
      street: "7342 W Foster Ave",
      cityState: "Chicago, IL",
      zipCode: "60656",
      localTime: "11:00 PM PDT",
    },
  ]

  const sampleBatching: BatchingConfig = {
    environment: "QA3",
    dynamicBatch: false,
    sectorBatch: true,
    rollingPicklist: true,
    twm: true,
    bulkBatching: false,
    maxOrders: 3,
    minOrdersToBatch: 2,
    maxTotes: 5,
    maxTotesPerOrder: 4,
    maxSectorTotes: 6,
    maxSectors: 6,
  }

  const [store, setStore] = useState<StoreInfo | null>(sampleStores[0])
  const [batching, setBatching] = useState<BatchingConfig | null>(
    sampleBatching,
  )

  const matchedClusterStore =
    environment === "QA3" && searchValue.trim()
      ? sampleStores.find((item) =>
          searchBy === "store"
            ? item.siteId.startsWith(searchValue.trim())
            : item.zipCode.startsWith(searchValue.trim()),
        )
      : undefined

  const fieldClass =
    "h-[42px] w-full rounded-lg border border-[#D5DCE5] bg-white px-3 text-[13px] font-medium text-[#17233D] outline-none focus:border-[#003B70] focus:ring-2 focus:ring-[#003B70]/10"

  const labelClass =
    "mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-[#778198]"

  const performLookup = () => {
    const value = searchValue.trim()

    if (!value) {
      setMessage(
        searchBy === "store"
          ? "Please enter a Store / Site ID."
          : "Please enter a ZIP Code.",
      )
      return
    }

    setLoading(true)
    setMessage("")

    // Find the matching store using the updated sampleStores array
    const matchedStore =
      environment === "QA3"
        ? sampleStores.find((item) =>
            searchBy === "store"
              ? item.siteId === value
              : item.zipCode !== "" && item.zipCode === value,
          )
        : undefined

    if (matchedStore) {
      setStore(matchedStore)
      setBatching(sampleBatching)
    } else {
      setStore(null)
      setBatching(null)
      setMessage(
        "No demo data is available for this search and environment. Connect the Store Lookup API to retrieve live information.",
      )
    }

    setLoading(false)
  }

  const storeFields = store
    ? [
        ["Site ID", store.siteId],
        ["Cluster", store.cluster],
        ["Banner", store.banner],
        ["Division", store.division],
        ["Street", store.street],
        ["City / State", store.cityState],
        ["Zip Code", store.zipCode],
        ["Local Time", store.localTime],
      ]
    : []

  const batchingFlags = batching
    ? [
        ["Dynamic Batch", batching.dynamicBatch],
        ["Sector Batch", batching.sectorBatch],
        ["Rolling Picklist", batching.rollingPicklist],
        ["TWM", batching.twm],
        ["Bulk Batching", batching.bulkBatching],
      ] as const
    : []

  const batchingLimits = batching
    ? [
        ["Max Orders", batching.maxOrders],
        ["Min Orders to Batch", batching.minOrdersToBatch],
        ["Max Totes", batching.maxTotes],
        ["Max Totes / Order", batching.maxTotesPerOrder],
        ["Max Sector Totes", batching.maxSectorTotes],
        ["Max Sectors", batching.maxSectors],
      ] as const
    : []

  return (
    <div className="pb-10">
      {/* Page header */}
      <div className="mb-7">
        <h1 className="text-[28px] font-bold tracking-[-0.035em] text-[#13203D] sm:text-[34px]">
          Store Lookup
        </h1>
        <p className="mt-2 text-[13px] text-[#667085]">
          Find store information, cluster assignments, and batching
          configurations in one place.
        </p>
      </div>

      {/* Lookup controls */}

      <section className="rounded-xl border border-[#DDE3E9] bg-white p-5 shadow-sm sm:p-6">
        <div className="space-y-4">
          {/* First row: Environment */}
          <div className="w-full md:w-[220px]">
            <label htmlFor="store-environment" className={labelClass}>
              Environment
            </label>

            <select
              id="store-environment"
              value={environment}
              onChange={(e) => {
                setEnvironment(e.target.value)
                setStore(null)
                setBatching(null)
                setMessage("")
              }}
              className={fieldClass}
            >
              <option value="QA3">QA3</option>
              <option value="QA2">QA2</option>
              <option value="Stage">Stage</option>
              <option value="Production">Production</option>
            </select>
          </div>

          {/* Second row: Search By + Input + Fetch Details */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-8">
            {/* Search By */}
            <div className="shrink-0">
              <span className={labelClass}>Search By</span>

              <fieldset
                className="inline-flex min-h-[42px] flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border border-[#B8C5D3] bg-white px-4 py-2"
                aria-label="Search by"
              >
                <label className="flex cursor-pointer items-center gap-2 text-[13px] font-medium text-[#34445C]">
                  <input
                    type="radio"
                    name="store-search-by"
                    checked={searchBy === "store"}
                    onChange={() => {
                      setSearchBy("store")
                      setSearchValue("")
                      setStore(null)
                      setBatching(null)
                      setMessage("")
                    }}
                    className="size-4 accent-[#00539B]"
                  />
                  Store ID / Site ID
                </label>

                <label className="flex cursor-pointer items-center gap-2 text-[13px] font-medium text-[#34445C]">
                  <input
                    type="radio"
                    name="store-search-by"
                    checked={searchBy === "zip"}
                    onChange={() => {
                      setSearchBy("zip")
                      setSearchValue("")
                      setStore(null)
                      setBatching(null)
                      setMessage("")
                    }}
                    className="size-4 accent-[#00539B]"
                  />
                  ZIP Code
                </label>
              </fieldset>
            </div>

            {/* Search Input */}
            <div className="w-full sm:max-w-[420px] sm:min-w-0 sm:flex-1">
              <label htmlFor="store-search-input" className={labelClass}>
                {searchBy === "store" ? "Store ID / Site ID" : "ZIP Code"}
              </label>

              <input
                id="store-search-input"
                type="text"
                inputMode="numeric"
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value)
                  setStore(null)
                  setBatching(null)
                  setMessage("")
                }}
                placeholder={
                  searchBy === "store" ? "Enter Store / Site ID" : "XXXXX"
                }
                className={fieldClass}
              />
              {matchedClusterStore && (
                <p
                  className="mt-2 text-[14px] font-semibold text-[#B66A0C]"
                  aria-live="polite"
                >
                  Cluster: {matchedClusterStore.cluster}
                </p>
              )}
            </div>

            {/* Fetch Details */}
            <button
              type="button"
              disabled={loading || !searchValue.trim()}
              onClick={performLookup}
              className="h-[42px] w-full shrink-0 rounded-lg bg-[#00539B] px-6 text-[13px] font-semibold text-white transition-colors hover:bg-[#003B70] disabled:cursor-not-allowed disabled:opacity-50 sm:mt-[22px] sm:w-auto"
            >
              {loading ? "Fetching..." : "Fetch Details"}
            </button>
          </div>

          {/* Status Message */}
          {message && (
            <div
              role="status"
              className="rounded-lg border border-[#E9D8B1] bg-[#FFF9ED] px-4 py-3 text-[12px] text-[#876317]"
            >
              {message}
            </div>
          )}
        </div>
      </section>

      {/* Store details */}
      {store && (
        <div className="mt-5 grid items-stretch gap-5 lg:grid-cols-2">
          {/* Store information */}
          <section className="rounded-xl border border-[#DDE3E9] bg-white shadow-sm">
            <div className="border-b border-[#EDF0F4] px-5 py-4">
              <h2 className="text-[16px] font-bold text-[#17233D]">
                Store Information
              </h2>
              <p className="mt-1 text-[12px] text-[#8791A0]">
                Location and store attributes
              </p>
            </div>

            <dl className="divide-y divide-[#F0F2F5] px-5">
              {storeFields.map(([label, value]) => (
                <div key={label}>
                  {/* Address subheading */}
                  {label === "Street" && (
                    <div className="pt-4 pb-1">
                      <h3 className="text-[13px] font-bold text-[#003B70]">
                        Address
                      </h3>
                    </div>
                  )}

                  {/* Existing store information row */}

                  <div
                    className={`flex items-start justify-between gap-4 py-3 ${
                      ["Street", "City / State", "Zip Code"].includes(label)
                        ? "pl-5"
                        : ""
                    }`}
                  >
                    <dt className="text-[12px] text-[#687386]">{label}</dt>

                    <dd
                      className={`text-right text-[12px] font-semibold ${
                        label === "Cluster"
                          ? "text-[#B66A0C]"
                          : "text-[#26324C]"
                      }`}
                    >
                      {value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </section>

          {/* Batching configuration */}
          {batching && (
            <section className="overflow-hidden rounded-xl border border-[#DDE3E9] bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-[#EDF0F4] px-5 py-4">
                <div>
                  <h2 className="text-[16px] font-bold text-[#17233D]">
                    Batching Configuration
                  </h2>
                  <p className="mt-1 text-[12px] text-[#8791A0]">
                    Feature flags and batching limits
                  </p>
                </div>

                <span className="rounded-full bg-[#E8F0F7] px-3 py-1 text-[11px] font-bold text-[#003B70]">
                  {batching.environment}
                </span>
              </div>

              <div className="px-5 pt-2">
                {batchingFlags.map(([label, enabled]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-3 border-b border-[#F0F2F5] py-2.5 last:border-b-0"
                  >
                    <span className="text-[12px] text-[#526174]">{label}</span>

                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        enabled
                          ? "bg-[#E8F7EE] text-[#16765B]"
                          : "bg-[#FCEBED] text-[#C04755]"
                      }`}
                    >
                      {enabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
                {batchingLimits.map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-lg border border-[#E6EBF0] bg-[#F8FAFC] px-4 py-2"
                  >
                    <p className="text-[10px] text-center font-bold uppercase tracking-[0.06em] text-[#526174]">
                      {label}
                    </p>
                    <p className="mt-1 text-center text-[19px] font-bold text-[#17233D]">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Initial or no-result state */}
      {!store && !message && (
        <div className="mt-6 rounded-xl border border-dashed border-[#CFD6DF] bg-white px-6 py-16 text-center">
          <h2 className="text-[15px] font-bold text-[#26324C]">
            Ready to look up a store
          </h2>
          <p className="mt-2 text-[13px] text-[#667085]">
            Select an environment, choose a search method, and enter a Store /
            Site ID or ZIP Code to get started.{" "}
          </p>
        </div>
      )}
      <StoreClusterReferenceTable />
      <p className="mt-5 text-[11px] text-[#98A2B3]">
        Prototype preview: store 1502 in QA3 uses sample data from the existing
        portal. Live API integration is not connected.
      </p>
    </div>
  )
}

function BellIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 21h4" strokeLinecap="round" />
    </svg>
  )
}

function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      aria-hidden="true"
    >
      <path d="m8 10 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function AccordionIcon({
  expanded,
  className,
}: IconProps & { expanded: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 12h12" strokeLinecap="round" />
      {!expanded && <path d="M12 6v12" strokeLinecap="round" />}
    </svg>
  )
}

function BeakerIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M9 3h6M10 3v6l-5.5 9.3A1.8 1.8 0 0 0 6 21h12a1.8 1.8 0 0 0 1.5-2.7L14 9V3M7.5 15h9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function InboxIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4 5h16v14H4zM4 14h4l2 3h4l2-3h4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PulseIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M3 12h4l2.2-6 4.1 12 2.2-6H21"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function StoreIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4 10v10h16V10M3 10l2-6h14l2 6M8 20v-6h8v6M3 10c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function GrafanaIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M7 16l4-5 3 2 3-5" />
      <path d="M15 8h2v2" />
    </svg>
  )
}

function PlayIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <path
        d="m8 5 11 7-11 7V5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function LayersIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <path
        d="m12 3 9 5-9 5-9-5 9-5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m3 12 9 5 9-5M3 16l9 5 9-5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ClockIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ExternalLinkIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M14 5h5v5M19 5l-8 8M18 13v5H6V6h5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

//Onboarding Page
type OnboardingRequest = {
  requestNumber: string
  requestType: "Add Project" | "Request Access" | "Revoke Access" | "Other Requests"
  status: "Submitted" | "In Progress" | "Need More Details" | "Completed" | "Rejected"
  submissionDate: string
  details: Record<string, string>

  // Admin feedback
  adminMessage?: string
  rejectionReason?: string
  rejectionDetails?: string
  reviewedAt?: string
}

const ACCESS_REQUEST_STORAGE_KEY = "atlas360-onboarding-requests"
const ACCESS_REQUEST_UPDATED_EVENT = "atlas360-onboarding-history-updated"

function readAccessRequests(): OnboardingRequest[] {
  try {
    const saved = window.localStorage.getItem(ACCESS_REQUEST_STORAGE_KEY)
    const parsed = saved ? JSON.parse(saved) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const ONBOARDING_HISTORY_KEY = "atlas360-onboarding-requests"
const DEMO_ONBOARDING_HISTORY: OnboardingRequest[] = [
  {
    requestNumber: "ONB-DEMO-001",
    requestType: "Add Project",
    status: "Complete",
    submissionDate: "2026-10-20T09:15:00",
    details: {
      projectName: "Fulfillment",
      podName: "Order Management",
    },
  },
  {
    requestNumber: "ONB-DEMO-002",
    requestType: "Request Access",
    status: "In Progress",
    submissionDate: "2026-10-19T15:30:00",
    details: {
      projectName: "Enterprise Item",
      podName: "Catalog Services",
    },
  },
]
function getOnboardingHistory(): OnboardingRequest[] {
  try {
    const saved = window.localStorage.getItem(ONBOARDING_HISTORY_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function OnboardingPage({
  onBack,
  onOpenRequestHistory,
  initialAction = "add",
}: {
  onBack: () => void
  onOpenRequestHistory: () => void
  initialAction?: "add" | "request" | "revoke" | "other"
}) {
  const [selectedAction, setSelectedAction] =
    useState<"add" | "request" | "revoke" | "other" | null>(initialAction)

  useEffect(() => {
    setSelectedAction(initialAction)
  }, [initialAction])

  const [onboardingRequests, setOnboardingRequests] =
    useState<OnboardingRequest[]>(() => {
      try {
        const saved = window.localStorage.getItem(
          "atlas360-onboarding-requests",
        )
        return saved ? JSON.parse(saved) : []
      } catch {
        return []
      }
    })

  const [viewingRequest, setViewingRequest] =
    useState<OnboardingRequest | null>(null)

  const projectOptions = ["Fulfillment", "Enterprise Item"]
  const podOptions = ["Fulfillment POD", "Enterprise Item POD"] // Replace with actual PODs

  const submitOnboardingRequest = (
    requestType: OnboardingRequest["requestType"],
    details: Record<string, string>,
  ) => {
    const nextRequestNumber =
      Math.max(
        100000,
        ...onboardingRequests.map((request) => {
          const number = Number(request.requestNumber.replace("OB-", ""))
          return Number.isFinite(number) ? number : 0
        }),
      ) + 1
    const request: OnboardingRequest = {
      requestNumber: `OB-${nextRequestNumber}`,
      requestType,
      status: "Submitted",
      submissionDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      details,
    }
    setOnboardingRequests((previous) => {
      const updated = [request, ...previous]
      try {
        window.localStorage.setItem(
          "atlas360-onboarding-requests",
          JSON.stringify(updated),
        )
      } catch {
        // Keep the current-session history if browser storage is unavailable.
      }
      return updated
    })

    window.dispatchEvent(new Event("atlas360-onboarding-history-updated"))

    setSelectedAction(null)
  }

  const actions = [
    { id: "add", label: "Add Project" },
    { id: "request", label: "Request Access" },
    { id: "revoke", label: "Revoke Access" },
    { id: "other", label: "Other Requests" },
  ] as const

  const selectedIndex = actions.findIndex((a) => a.id === selectedAction)

  const selectedTitle =
    actions.find((action) => action.id === selectedAction)?.label ?? ""

  return (
    <div className="pb-10">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back to ATLAS360"
        title="Back to ATLAS360"
        className="
    mb-3 inline-flex
    h-9 w-11
    items-center justify-center
    rounded-lg
    bg-[#003B70] text-white
    shadow-sm
    transition-all duration-200
    hover:bg-[#00539B]
    hover:shadow-md
    active:scale-95
    focus-visible:outline
    focus-visible:outline-2
    focus-visible:outline-offset-2
    focus-visible:outline-[#00539B]
  "
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </svg>
      </button>

      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#13203D] sm:text-[34px]">
            Onboarding
          </h1>
          <p className="mt-2 text-[13px] text-[#69748B]">
            Manage project onboarding and access requests.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenRequestHistory}
          className="inline-flex items-center gap-2 rounded-lg border border-[#00539B] bg-white px-4 py-2.5 text-[12px] font-semibold text-[#00539B] transition-colors hover:bg-[#E8F0F7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00539B]"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 12a9 9 0 1 0 3-6.7" />
            <path d="M3 3v6h6" />
            <path d="M12 7v5l3 2" />
          </svg>
          View your request
        </button>
      </div>

      <div className="grid grid-cols-1 items-start gap-5">
        {/* LEFT: Onboarding actions and forms */}
        <section className="min-w-0 rounded-xl border border-[#DDE3E9] bg-white p-6 shadow-sm">
          {/* Compact onboarding action buttons */}
          <div className="grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                id: "add",
                title: "Add Project",
                subtitle: "Onboard a new project to the automation platform",
              },
              {
                id: "request",
                title: "Request Access",
                subtitle: "Request access to an existing automation project",
              },
              {
                id: "revoke",
                title: "Revoke Access",
                subtitle: "Remove a user's access to an automation project",
              },
              {
                id: "other",
                title: "Other Requests",
                subtitle: "Submit an automation-related request",
              },
            ].map((action) => {
              const isSelected = selectedAction === action.id

              return (
                <div key={action.id} className="relative min-w-0">
                  <button
                    type="button"
                    aria-expanded={isSelected}
                    aria-controls="onboarding-form-panel"
                    onClick={() =>
                      setSelectedAction(
                        isSelected
                          ? null
                          : action.id as "add" | "request" | "revoke" | "other",
                      )
                    }
                    className={`group flex min-h-[112px] w-full flex-col justify-between rounded-lg border p-3 text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00539B] ${
                      isSelected
                        ? "border-[#00539B] bg-[#F0F6FC] shadow-md ring-1 ring-[#00539B]"
                        : "border-[#DDE3E9] bg-white hover:border-[#9CB6CD] hover:bg-[#F8FBFE]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Action icon */}
                      <span
                        className={`flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${
                          isSelected
                            ? "bg-[#003B70] text-white"
                            : "bg-[#E8F0F7] text-[#003B70]"
                        }`}
                      >
                        {action.id === "add" ? (
                          <svg
                            width="19"
                            height="19"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
                            <path d="M12 11v6M9 14h6" />
                          </svg>
                        ) : action.id === "request" ? (
                          <svg
                            width="19"
                            height="19"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <circle cx="9" cy="8" r="3" />
                            <path d="M3 20v-2a6 6 0 0 1 12 0v2" />
                            <path d="M19 8v6M16 11h6" />
                          </svg>
                        ) : (
                          <svg
                            width="19"
                            height="19"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <circle cx="9" cy="8" r="3" />
                            <path d="M3 20v-2a6 6 0 0 1 12 0v2" />
                            <path d="M16 11h6" />
                          </svg>
                        )}
                      </span>

                      {/* Title and subheading */}
                      <div className="min-w-0">
                        <h3 className="text-[13px] font-bold text-[#17233D]">
                          {action.title}
                        </h3>
                        <p className="mt-1 text-[11px] leading-4 text-[#526174]">
                          {action.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Call to action */}
                    <div className="mt-2 flex items-center justify-end gap-2">
                      <span className="ml-auto text-[12px] font-semibold text-[#00539B] group-hover:underline">
                        Submit Request
                      </span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-[#00539B] transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      >
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </div>
                  </button>
                </div>
              )
            })}
          </div>

          {/* Form panel, connected to the selected card by a notch */}
          {selectedAction && (
            <div
              id="onboarding-form-panel"
              role="region"
              aria-label={selectedTitle}
              className="relative mt-3 rounded-xl border border-[#00539B] bg-white p-5 sm:p-6"
            >
              {/* Notch pointing at the selected card (hidden on mobile where cards stack) */}
              <span
                aria-hidden="true"
                className="absolute -top-[9px] hidden size-4 -translate-x-1/2 rotate-45 border-l border-t border-[#00539B] bg-white transition-[left] duration-300 ease-out sm:block"
                style={{
                  left: `calc((100% - 36px) / 4 * ${selectedIndex} + ${
                    selectedIndex * 12
                  }px + (100% - 36px) / 8)`,
                }}
              />

              <h2 className="mb-5 text-[18px] font-bold text-[#17233D]">
                {selectedTitle}
              </h2>

              {selectedAction === "add" && (
                <form
                  onSubmit={(event) => {
                    event.preventDefault()
                    const data = new FormData(event.currentTarget)
                    submitOnboardingRequest(
                      "Add Project",
                      Object.fromEntries(
                        data.entries(),
                      ) as Record<string, string>,
                    )
                  }}
                  className="mt-0 overflow-hidden rounded-xl border border-[#DDE3E9] bg-white shadow-sm"
                >
                  <div className="border-b border-[#E9EDF1] px-5 py-4">
                    <p className="mt-1 text-[12px] text-[#526174]">
                      Provide the project and automation details to request
                      onboarding.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
                    <label className="block sm:col-span-2">
                      <span className="mb-1.5 block text-[13px] font-semibold text-[#17233D]">
                        Requestor's Name *
                      </span>
                      <input
                        name="requestorName"
                        type="text"
                        required
                        placeholder="Enter requestor's full name"
                        className="w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2.5 text-[13px] text-[#17233D] focus:outline-none focus:ring-2 focus:ring-[#00539B]"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-[13px] font-semibold text-[#17233D]">
                        Project name *
                      </span>
                      <input
                        name="projectName"
                        type="text"
                        required
                        placeholder="Enter project name"
                        className="w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2.5 text-[13px] text-[#17233D] focus:outline-none focus:ring-2 focus:ring-[#00539B]"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-[13px] font-semibold text-[#17233D]">
                        POD name *
                      </span>
                      <input
                        name="podName"
                        type="text"
                        required
                        placeholder="Enter POD name"
                        className="w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2.5 text-[13px] text-[#17233D] focus:outline-none focus:ring-2 focus:ring-[#00539B]"
                      />
                    </label>

                    <label className="block sm:col-span-2">
                      <span className="mb-1.5 block text-[13px] font-semibold text-[#17233D]">
                        GitHub repository link *{" "}
                      </span>
                      <input
                        name="githubRepo"
                        type="url"
                        required
                        placeholder="https://github.com/organization/repository"
                        className="w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2.5 text-[13px] text-[#17233D] focus:outline-none focus:ring-2 focus:ring-[#00539B]"
                      />
                    </label>

                    <label className="block sm:col-span-2">
                      <span className="mb-1.5 block text-[13px] font-semibold text-[#17233D]">
                        Last run details with report
                      </span>
                      <textarea
                        name="lastRunDetails"
                        rows={2}
                        placeholder="Last execution date, status, and report URL..."
                        className="w-full resize-y rounded-lg border border-[#CBD5E1] bg-white px-3 py-2.5 text-[13px] text-[#17233D] focus:outline-none focus:ring-2 focus:ring-[#00539B]"
                      />
                    </label>

                    <label className="block sm:col-span-2">
                      <span className="mb-1.5 block text-[13px] font-semibold text-[#17233D]">
                        Automation suite tech stack *{" "}
                      </span>
                      <input
                        name="techStack"
                        type="text"
                        required
                        placeholder="e.g., Playwright, TypeScript, GitHub Actions"
                        className="w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2.5 text-[13px] text-[#17233D] focus:outline-none focus:ring-2 focus:ring-[#00539B]"
                      />
                    </label>

                    <label className="block sm:col-span-2">
                      <span className="mb-1.5 block text-[13px] font-semibold text-[#17233D]">
                        Additional details
                      </span>
                      <textarea
                        name="additionalDetails"
                        rows={3}
                        placeholder="Any other details or onboarding requirements..."
                        className="w-full resize-y rounded-lg border border-[#CBD5E1] bg-white px-3 py-2.5 text-[13px] text-[#17233D] focus:outline-none focus:ring-2 focus:ring-[#00539B]"
                      />
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 border-t border-[#E9EDF1] px-5 py-4">
                    <button
                      type="button"
                      onClick={() => setSelectedAction(null)}
                      className="rounded-lg border border-[#CBD5E1] bg-white px-5 py-2.5 text-[13px] font-semibold text-[#334155] hover:bg-[#F4F6F8]"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="rounded-lg bg-[#003B70] px-6 py-2.5 text-[13px] font-semibold text-white hover:bg-[#00539B]"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              )}

              {(selectedAction === "request" ||
                selectedAction === "revoke") && (
                <form
                  key={selectedAction}
                  onSubmit={(event) => {
                    event.preventDefault()
                    const data = new FormData(event.currentTarget)
                    const users = String(data.get("requestingFor") || "")
                      .split(",")
                      .map((value) => value.trim())
                      .filter(Boolean)
                    if (!users.length) return
                    submitOnboardingRequest(
                      selectedAction === "request"
                        ? "Request Access"
                        : "Revoke Access",
                      {
                        requestorName: String(data.get("requestorName") || ""),
                        requestingFor: users.join(", "),
                        project: String(data.get("project") || ""),
                        pod: String(data.get("pod") || ""),
                        businessJustification: String(
                          data.get("businessJustification") || "",
                        ),
                      },
                    )
                  }}
                  className="mt-0 overflow-hidden rounded-xl border border-[#DDE3E9] bg-white shadow-sm"
                >
                  <div className="border-b border-[#E9EDF1] px-5 py-4">
                    <p className="text-[12px] text-[#526174]">
                      {selectedAction === "request"
                        ? "Provide the details to request project access."
                        : "Provide the details to revoke project access."}
                    </p>
                  </div>
                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-[13px] font-semibold text-[#17233D]">
                      Requestor's Name *
                    </span>
                    <input
                      name="requestorName"
                      type="text"
                      required
                      placeholder="Enter requestor's full name"
                      className="w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2.5 text-[13px] text-[#17233D] focus:outline-none focus:ring-2 focus:ring-[#00539B]"
                    />
                  </label>
                  <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
                    <label className="block sm:col-span-2">
                      <span className="mb-1.5 block text-[13px] font-semibold text-[#17233D]">
                        Requesting for *
                      </span>
                      <input
                        name="requestingFor"
                        type="text"
                        required
                        placeholder="user1@company.com, user2@company.com"
                        className="w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2.5 text-[13px] text-[#17233D] focus:outline-none focus:ring-2 focus:ring-[#00539B]"
                      />
                      <span className="mt-1 block text-[11px] text-[#687386]">
                        Enter multiple users separated by commas.
                      </span>
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-[13px] font-semibold text-[#17233D]">
                        Project *
                      </span>
                      <input
                        name="project"
                        type="text"
                        list="onboarding-project-options"
                        required
                        placeholder="Search or select project"
                        className="w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2.5 text-[13px] text-[#17233D] focus:outline-none focus:ring-2 focus:ring-[#00539B]"
                      />
                      <datalist id="onboarding-project-options">
                        {projectOptions.map((project) => (
                          <option key={project} value={project} />
                        ))}
                      </datalist>
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-[13px] font-semibold text-[#17233D]">
                        POD *
                      </span>
                      <input
                        name="pod"
                        type="text"
                        list="onboarding-pod-options"
                        required
                        placeholder="Search or select POD"
                        className="w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2.5 text-[13px] text-[#17233D] focus:outline-none focus:ring-2 focus:ring-[#00539B]"
                      />
                      <datalist id="onboarding-pod-options">
                        {podOptions.map((pod) => (
                          <option key={pod} value={pod} />
                        ))}
                      </datalist>
                    </label>

                    <label className="block sm:col-span-2">
                      <span className="mb-1.5 block text-[13px] font-semibold text-[#17233D]">
                        Business justification *{" "}
                      </span>
                      <textarea
                        name="businessJustification"
                        rows={4}
                        required
                        placeholder="Explain the business reason for this request..."
                        className="w-full resize-y rounded-lg border border-[#CBD5E1] bg-white px-3 py-2.5 text-[13px] text-[#17233D] focus:outline-none focus:ring-2 focus:ring-[#00539B]"
                      />
                    </label>
                  </div>
                  <div className="flex justify-end gap-3 border-t border-[#E9EDF1] px-5 py-4">
                    <button
                      type="button"
                      onClick={() => setSelectedAction(null)}
                      className="rounded-lg border border-[#CBD5E1] bg-white px-5 py-2.5 text-[13px] font-semibold text-[#334155] hover:bg-[#F4F6F8]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-[#003B70] px-6 py-2.5 text-[13px] font-semibold text-white hover:bg-[#00539B]"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              )}

              {selectedAction === "other" && (
                <form
                  onSubmit={(event) => {
                    event.preventDefault()

                    const data = new FormData(event.currentTarget)

                    submitOnboardingRequest("Other Requests", {
                      requestorName: String(
                        data.get("requestorName") || "",
                      ).trim(),
                      project: String(data.get("project") || "").trim(),
                      requestDescription: String(
                        data.get("requestDescription") || "",
                      ).trim(),
                      isAutomated: String(data.get("isAutomated") || ""),
                      repository: String(data.get("repository") || "").trim(),
                      techStack: String(data.get("techStack") || "").trim(),
                      frequency: String(data.get("frequency") || ""),
                      timeSaved: String(data.get("timeSaved") || "").trim(),
                      audience: String(data.get("audience") || "").trim(),
                    })
                  }}
                  className="overflow-hidden rounded-xl border border-[#DDE3E9] bg-white"
                >
                  <div className="border-b border-[#DDE3E9] bg-[#F4F8FC] px-5 py-4">
                    <p className="mt-1 text-[12px] text-[#526174]">
                      Share your automation requirements and expected business
                      impact.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
                    <label className="block sm:col-span-2">
                      <span className="mb-1.5 block text-[13px] font-semibold text-[#17233D]">
                        Requestor's Name *
                      </span>
                      <input
                        name="requestorName"
                        type="text"
                        required
                        placeholder="Enter requestor's full name"
                        className="w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2.5 text-[13px] text-[#17233D] focus:outline-none focus:ring-2 focus:ring-[#00539B]"
                      />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="mb-1.5 block text-[13px] font-semibold text-[#17233D]">
                        Project *
                      </span>
                      <input
                        name="project"
                        required
                        placeholder="Enter project name"
                        className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2.5 text-[13px]"
                      />
                    </label>

                    <label className="block sm:col-span-2">
                      <span className="mb-1.5 block text-[13px] font-semibold text-[#17233D]">
                        What is the request? *
                      </span>
                      <textarea
                        name="requestDescription"
                        required
                        rows={3}
                        placeholder="Describe the request"
                        className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2.5 text-[13px]"
                      />
                    </label>

                    <fieldset className="sm:col-span-2">
                      <legend className="mb-2 text-[13px] font-semibold text-[#17233D]">
                        Is this currently automated? *
                      </legend>
                      <div className="flex flex-wrap gap-5">
                        {["Yes", "No", "Partially"].map((option) => (
                          <label
                            key={option}
                            className="flex items-center gap-2 text-[13px]"
                          >
                            <input
                              type="radio"
                              name="isAutomated"
                              value={option}
                              required
                              defaultChecked={option === "No"}
                              className="accent-[#00539B]"
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <label className="block">
                      <span className="mb-1.5 block text-[13px] font-semibold text-[#17233D]">
                        Repository URL
                      </span>
                      <input
                        name="repository"
                        type="url"
                        placeholder="https://github.com/..."
                        className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2.5 text-[13px]"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-[13px] font-semibold text-[#17233D]">
                        Technology Stack
                      </span>
                      <input
                        name="techStack"
                        placeholder="e.g., Playwright, Java, Python"
                        className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2.5 text-[13px]"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-[13px] font-semibold text-[#17233D]">
                        Request Frequency *
                      </span>
                      <input
                        name="frequency"
                        type="text"
                        placeholder="10 request per day, often, etc."
                        className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2.5 text-[13px]"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-[13px] font-semibold text-[#17233D]">
                        Estimated Time Saved *
                      </span>
                      <input
                        name="timeSaved"
                        required
                        placeholder="e.g., 2 hours per execution"
                        className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2.5 text-[13px]"
                      />
                    </label>

                    <label className="block sm:col-span-2">
                      <span className="mb-1.5 block text-[13px] font-semibold text-[#17233D]">
                        Benefiting Audience *
                      </span>
                      <textarea
                        name="audience"
                        required
                        rows={2}
                        placeholder="e.g., QE, Developers, Release Team, Operations"
                        className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2.5 text-[13px]"
                      />
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 border-t border-[#DDE3E9] px-5 py-4">
                    <button
                      type="button"
                      onClick={() => setSelectedAction(null)}
                      className="rounded-lg border border-[#CBD5E1] px-5 py-2.5 text-[13px] font-semibold text-[#34415B]"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="rounded-lg bg-[#003B70] px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#00539B]"
                    >
                      Submit Request
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

//Contact Us page
function ContactUsPage({ onBack }: { onBack: () => void }) {
  // Replace with your actual support email
  const supportEmail = "atlas360@albertsons.com"

  return (
    <div className="pb-10">
      {/* Back navigation */}
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#003B70] transition-colors hover:bg-[#E8F0F7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00539B]"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </svg>
      </button>

      {/* Page heading */}
      <div className="mb-7">
        <h1 className="text-[28px] font-bold text-[#13203D] sm:text-[34px]">
          Contact Us
        </h1>
        <p className="mt-2 text-[13px] text-[#69748B]">
          We're here to help you get the most out of ATLAS360.
        </p>
      </div>

      <div className="space-y-5">
        {/* Primary support card */}
        <section className="rounded-xl border border-[#DDE3E9] bg-white p-6 shadow-sm sm:p-7">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#E8F0F7] text-[#003B70]">
              <svg
                width="25"
                height="25"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 14v-3a9 9 0 0 1 18 0v3" />
                <rect x="2" y="12" width="4" height="7" rx="2" />
                <rect x="18" y="12" width="4" height="7" rx="2" />
                <path d="M20 19a5 5 0 0 1-5 3h-3" />
              </svg>
            </div>

            <div>
              <h2 className="text-[19px] font-bold text-[#17233D]">
                How can we help?
              </h2>
              <p className="mt-2 max-w-[650px] text-[13px] leading-6 text-[#526174]">
                Have a question, found an issue, or need assistance with
                ATLAS360? Reach out to our support team.
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-[#E8EDF2] pt-6">
            <p className="mb-3 text-[12px] font-semibold text-[#526174]">
              Support Email
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <a
                href={`mailto:${supportEmail}`}
                className="inline-flex min-w-0 items-center gap-3 text-[14px] font-semibold text-[#00539B] hover:underline break-all"
              >
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0"
                  aria-hidden="true"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
                {supportEmail}
              </a>

              <a
                href={`mailto:${supportEmail}?subject=${encodeURIComponent("ATLAS360 Support Request")}`}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#003B70] px-5 py-2.5 text-[12px] font-semibold text-white transition hover:bg-[#00539B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00539B]"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
                Send an Email
              </a>
            </div>
          </div>
        </section>

        {/* Support guidance card */}
        <section className="rounded-xl border border-[#DDE3E9] bg-white p-6 shadow-sm sm:p-7">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#E8F0F7] text-[#003B70]">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="5" y="4" width="14" height="17" rx="2" />
                <path d="M9 4.5h6M9 10h6M9 14h6M9 18h4" />
              </svg>
            </div>

            <h2 className="text-[17px] font-bold text-[#17233D]">
              Help us assist you faster
            </h2>
          </div>

          <p className="mt-3 text-[13px] text-[#526174]">
            When contacting the team, please include the following details
            whenever applicable:
          </p>

          <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            {[
              {
                number: "01",
                title: "Issue or Request",
                description:
                  "Briefly describe what you need help with along with Request/Reference number if available.",
              },
              {
                number: "02",
                title: "Project & Environment",
                description:
                  "Mention the project and environment, if applicable.",
              },
              {
                number: "03",
                title: "Steps to Reproduce",
                description: "Explain how the issue can be reproduced.",
              },
              {
                number: "04",
                title: "Screenshots",
                description: "Attach relevant screenshots when helpful.",
              },
            ].map((item) => (
              <div key={item.number} className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#E8F0F7] text-[12px] font-bold text-[#003B70]">
                  {item.number}
                </span>

                <div>
                  <h3 className="text-[13px] font-semibold text-[#17233D]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[12px] leading-5 text-[#69748B]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

// Request History Page
function HistoryDateTime({ value }: { value: string }) {
  const raw = String(value ?? "").trim()

  const hasTime = /\d{1,2}:\d{2}/.test(raw)

  const parsed = new Date(raw)
  const valid = raw !== "" && !Number.isNaN(parsed.getTime())

  const date = valid
    ? parsed.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : raw || "—"

  const time =
    valid && hasTime
      ? parsed.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        })
      : null

  return (
    <div className="flex items-center gap-2">
      <ClockIcon className="size-4 shrink-0 text-[#9aa4b5]" />

      <div className="flex flex-col gap-0.5">
        <span className="text-[12px] font-medium text-[#34445C]">{date}</span>

        {time && <span className="text-[11px] text-[#69748B]">{time}</span>}
      </div>
    </div>
  )
}
function HistoryStatusBadge({ status }: { status: string }) {
  const normalized = status.trim().toLowerCase()

  let colors = "bg-[#F1F5F9] text-[#475569]"

  if (normalized === "submitted" || normalized === "pending") {
    colors = "bg-[#FFF4E2] text-[#95620B]"
  } else if (normalized === "in progress" || normalized === "running") {
    colors = "bg-[#E8F0F7] text-[#003B70]"
  } else if (
    normalized === "completed" ||
    normalized === "complete" ||
    normalized === "passed"
  ) {
    colors = "bg-[#E7F5F0] text-[#13795B]"
  } else if (normalized === "failed" || normalized === "rejected") {
    colors = "bg-[#FDEAEA] text-[#B42318]"
  }

  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold ${colors}`}
    >
      {status}
    </span>
  )
}

function AutomationProjectManagement() {
  const automationProjects = useAutomationProjects()

  const [expandedIds, setExpandedIds] = useState<string[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<AutomationProject | null>(
    null,
  )
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const primaryProjects = automationProjects.filter(
    (project) => project.type === "primary",
  )

  const toggleProject = (id: string) => {
    setExpandedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    )
  }

  const startEditing = (project: AutomationProject) => {
    setEditingId(project.id)
    setEditingName(project.name)
    setError("")
    setSuccess("")
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditingName("")
    setError("")
  }

  const saveName = (project: AutomationProject) => {
    const name = editingName.trim()
    setError("")
    setSuccess("")

    if (!name) {
      setError("Project or POD name cannot be empty.")
      return
    }

    const latest = readAutomationProjects()

    const duplicate = latest.some((item) => {
      if (item.id === project.id) return false

      if (project.type === "primary") {
        return (
          item.type === "primary" &&
          item.name.toLowerCase() === name.toLowerCase()
        )
      }

      return (
        item.type === "sub-project" &&
        item.parentId === project.parentId &&
        item.name.toLowerCase() === name.toLowerCase()
      )
    })

    if (duplicate) {
      setError("This name already exists in the selected project.")
      return
    }

    const updated = latest.map((item) =>
      item.id === project.id ? { ...item, name } : item,
    )

    try {
      saveAutomationProjects(updated)
      setEditingId(null)
      setEditingName("")
      setSuccess(`"${project.name}" renamed to "${name}".`)
    } catch {
      setError("Unable to save the name change.")
    }
  }

  const confirmDelete = () => {
    if (!deleteTarget) return

    const target = deleteTarget
    const latest = readAutomationProjects()

    const updated = latest.filter((item) => {
      if (item.id === target.id) return false

      if (target.type === "primary" && item.parentId === target.id) {
        return false
      }

      return true
    })

    try {
      saveAutomationProjects(updated)

      setExpandedIds((current) => current.filter((id) => id !== target.id))

      if (
        editingId === target.id ||
        (target.type === "primary" &&
          latest.some(
            (item) => item.id === editingId && item.parentId === target.id,
          ))
      ) {
        setEditingId(null)
      }

      setSuccess(
        target.type === "primary"
          ? `Project "${target.name}" and its PODs were deleted.`
          : `POD "${target.name}" was deleted.`,
      )

      setError("")
      setDeleteTarget(null)
    } catch {
      setError("Unable to delete this entry.")
      setDeleteTarget(null)
    }
  }

  const renderName = (project: AutomationProject) => {
    if (editingId === project.id) {
      return (
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={editingName}
            onChange={(event) => setEditingName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                saveName(project)
              }

              if (event.key === "Escape") {
                cancelEditing()
              }
            }}
            aria-label={`Edit ${project.name}`}
            className="min-w-0 flex-1 rounded-md border border-[#00539B] px-3 py-2 text-[12px] text-[#17233D] focus:outline-none focus:ring-2 focus:ring-[#00539B]"
            autoFocus
          />

          <button
            type="button"
            onClick={() => saveName(project)}
            className="rounded-md bg-[#003B70] px-3 py-2 text-[12px] font-semibold text-white hover:bg-[#00539B]"
          >
            Save
          </button>

          <button
            type="button"
            onClick={cancelEditing}
            className="rounded-md border border-[#CBD5E1] px-3 py-2 text-[12px] font-semibold text-[#526174] hover:bg-[#F4F6F8]"
          >
            Cancel
          </button>
        </div>
      )
    }

    return (
      <span className="text-[13px] font-semibold text-[#17233D]">
        {project.name}
      </span>
    )
  }

  const renderActions = (project: AutomationProject) => (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={() => startEditing(project)}
        disabled={editingId !== null}
        aria-label={`Edit ${project.name}`}
        className="rounded-md border border-[#BCD3E6] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#00539B] hover:bg-[#E8F0F7] disabled:opacity-40"
      >
        Edit
      </button>

      <button
        type="button"
        onClick={() => {
          setDeleteTarget(project)
          setError("")
        }}
        disabled={editingId !== null}
        aria-label={`Delete ${project.name}`}
        className="rounded-md border border-[#F2C7C7] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#B42318] hover:bg-[#FFF1F0] disabled:opacity-40"
      >
        Delete
      </button>
    </div>
  )

  return (
    <section className="mt-6 overflow-hidden rounded-xl border border-[#DDE3E9] bg-white shadow-sm">
      <div className="border-b border-[#E9EDF1] px-5 py-5">
        <h2 className="text-[17px] font-bold text-[#17233D]">
          Automation Project Management
        </h2>

        <p className="mt-1 text-[12px] leading-5 text-[#526174]">
          View, rename, or remove automation projects and their PODs. Changes
          are reflected in Automation Tests.
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-[#E8F0F7] px-3 py-1 text-[11px] font-semibold text-[#003B70]">
            {primaryProjects.length} Projects
          </span>

          <span className="rounded-full bg-[#F1F3F6] px-3 py-1 text-[11px] font-semibold text-[#526174]">
            {
              automationProjects.filter(
                (project) => project.type === "sub-project",
              ).length
            }{" "}
            PODs
          </span>
        </div>
      </div>

      {(error || success) && (
        <div className="px-5 pt-4">
          {error && (
            <p
              role="alert"
              className="rounded-lg border border-[#F2C7C7] bg-[#FFF4F2] px-3 py-2 text-[12px] text-[#B42318]"
            >
              {error}
            </p>
          )}

          {success && (
            <p
              role="status"
              className="rounded-lg border border-[#B7E2CA] bg-[#EFFAF3] px-3 py-2 text-[12px] text-[#16765B]"
            >
              {success}
            </p>
          )}
        </div>
      )}

      <div className="overflow-x-auto p-4 sm:p-5">
        <table className="w-full min-w-[540px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#DDE3E9] bg-[#F4F6F8]">
              <th className="px-4 py-3 text-[12px] font-bold text-[#34445C]">
                Project / POD Name
              </th>
              <th className="px-4 py-3 text-[12px] font-bold text-[#34445C]">
                Type
              </th>
              <th className="px-4 py-3 text-right text-[12px] font-bold text-[#34445C]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {primaryProjects.map((project) => {
              const pods = automationProjects.filter(
                (item) =>
                  item.type === "sub-project" && item.parentId === project.id,
              )

              const expanded = expandedIds.includes(project.id)

              return (
                <React.Fragment key={project.id}>
                  <tr className="border-b border-[#E9EDF1] bg-[#F0F6FC]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleProject(project.id)}
                          aria-expanded={expanded}
                          aria-label={`${
                            expanded ? "Collapse" : "Expand"
                          } ${project.name}`}
                          className="flex size-7 shrink-0 items-center justify-center rounded-md text-[#003B70] hover:bg-[#DCEAF6]"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                            className={`transition-transform ${
                              expanded ? "rotate-90" : ""
                            }`}
                          >
                            <path d="m9 18 6-6-6-6" />
                          </svg>
                        </button>

                        <div className="min-w-0 flex-1">
                          {renderName(project)}
                          <p className="mt-0.5 text-[11px] text-[#687386]">
                            {pods.length} PODs
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="rounded-full bg-[#DCEAF6] px-2.5 py-1 text-[11px] font-semibold text-[#003B70]">
                        Project
                      </span>
                    </td>

                    <td className="px-4 py-3">{renderActions(project)}</td>
                  </tr>

                  {expanded &&
                    pods.map((pod) => (
                      <tr
                        key={pod.id}
                        className="border-b border-[#EEF1F4] hover:bg-[#F8FAFC]"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 pl-9">
                            <span aria-hidden="true" className="text-[#98A2B3]">
                              ↳
                            </span>

                            <div className="min-w-0 flex-1">
                              {renderName(pod)}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <span className="rounded-full bg-[#F1F3F6] px-2.5 py-1 text-[11px] font-semibold text-[#526174]">
                            POD
                          </span>
                        </td>

                        <td className="px-4 py-3">{renderActions(pod)}</td>
                      </tr>
                    ))}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>

        {primaryProjects.length === 0 && (
          <p className="py-10 text-center text-[13px] text-[#687386]">
            No automation projects available.
          </p>
        )}
      </div>

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-[#0B223D]/40 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-automation-title"
            aria-describedby="delete-automation-description"
            className="w-full max-w-[440px] rounded-xl bg-white p-6 shadow-2xl"
          >
            <h3
              id="delete-automation-title"
              className="text-[19px] font-bold text-[#17233D]"
            >
              {deleteTarget.type === "primary"
                ? "Delete Project?"
                : "Delete POD?"}
            </h3>

            <p
              id="delete-automation-description"
              className="mt-3 text-[13px] leading-6 text-[#526174]"
            >
              {deleteTarget.type === "primary"
                ? `Deleting "${deleteTarget.name}" will also remove all its associated PODs from Automation Tests.`
                : `Are you sure you want to delete "${deleteTarget.name}" from Automation Tests?`}
            </p>

            <p className="mt-3 text-[12px] font-semibold text-[#B42318]">
              This action cannot be undone from this interface.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-[#CBD5E1] px-4 py-2.5 text-[13px] font-semibold text-[#34445C] hover:bg-[#F4F6F8]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-lg bg-[#B42318] px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-[#912018]"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
function AdminRequestCenterTab() {
  const [selectedAction, setSelectedAction] = useState<"project" | null>(
    "project",
  )

  const automationProjects = useAutomationProjects()

  const [selectedProjectId, setSelectedProjectId] = useState("")
  const [newProjectName, setNewProjectName] = useState("")
  const [referenceRequestNumber, setReferenceRequestNumber] = useState("")
  const [podNames, setPodNames] = useState([{ id: 1, name: "" }])
  const [nextPodId, setNextPodId] = useState(2)
  const [additionalNotes, setAdditionalNotes] = useState("")
  const [projectFormError, setProjectFormError] = useState("")
  const [projectFormSuccess, setProjectFormSuccess] = useState("")

  const primaryProjects = automationProjects.filter(
    (project) => project.type === "primary",
  )

  const resetProjectForm = () => {
    setSelectedProjectId("")
    setNewProjectName("")
    setReferenceRequestNumber("")
    setPodNames([{ id: 1, name: "" }])
    setNextPodId(2)
    setAdditionalNotes("")
    setProjectFormError("")
  }

  const addPodField = () => {
    setPodNames((current) => [...current, { id: nextPodId, name: "" }])
    setNextPodId((current) => current + 1)
  }

  const updatePodField = (id: number, name: string) => {
    setPodNames((current) =>
      current.map((pod) => (pod.id === id ? { ...pod, name } : pod)),
    )
  }

  const removePodField = (id: number) => {
    setPodNames((current) => current.filter((pod) => pod.id !== id))
  }
  const saveProjectForm = () => {
    setProjectFormError("")
    setProjectFormSuccess("")

    const reference = referenceRequestNumber.trim()
    const isNewProject = selectedProjectId === "__new__"
    const projectName = newProjectName.trim()

    if (!reference) {
      setProjectFormError("Enter the reference request number.")
      return
    }

    if (!selectedProjectId) {
      setProjectFormError("Select a project.")
      return
    }

    if (isNewProject && !projectName) {
      setProjectFormError("Enter the new project name.")
      return
    }

    if (
      isNewProject &&
      primaryProjects.some(
        (project) => project.name.toLowerCase() === projectName.toLowerCase(),
      )
    ) {
      setProjectFormError("A project with this name already exists.")
      return
    }

    const names = podNames.map((pod) => pod.name.trim())

    if (names.some((name) => !name)) {
      setProjectFormError("Enter a name for every POD field.")
      return
    }

    if (
      new Set(names.map((name) => name.toLowerCase())).size !== names.length
    ) {
      setProjectFormError("Duplicate POD names are not allowed.")
      return
    }

    const existingProject = primaryProjects.find(
      (project) => project.id === selectedProjectId,
    )

    if (!isNewProject && !existingProject) {
      setProjectFormError("The selected project could not be found.")
      return
    }

    const existingPodNames = new Set(
      automationProjects
        .filter((project) => project.parentId === selectedProjectId)
        .map((project) => project.name.toLowerCase()),
    )

    if (
      !isNewProject &&
      names.some((name) => existingPodNames.has(name.toLowerCase()))
    ) {
      setProjectFormError(
        "One or more POD names already exist under this project.",
      )
      return
    }

    const uniqueId = () => `atlas-${crypto.randomUUID()}`

    const parentId = isNewProject ? uniqueId() : selectedProjectId

    const additions: AutomationProject[] = []

    if (isNewProject) {
      additions.push({
        id: parentId,
        name: projectName,
        type: "primary",
        lastRun: "",
      })
    }

    names.forEach((name) => {
      additions.push({
        id: uniqueId(),
        name,
        type: "sub-project",
        parentId,
        lastRun: "",
      })
    })

    try {
      const latestProjects = readAutomationProjects()

      let updatedProjects: AutomationProject[]

      if (isNewProject) {
        // New primary projects and their PODs go at the end.
        updatedProjects = [...latestProjects, ...additions]
      } else {
        // Find the last row belonging to the selected primary project.
        const lastIndex = latestProjects.reduce(
          (last, project, index) =>
            project.id === selectedProjectId ||
            project.parentId === selectedProjectId
              ? index
              : last,
          -1,
        )

        // Insert new PODs immediately after the selected project's last POD.
        updatedProjects = [...latestProjects]

        updatedProjects.splice(lastIndex + 1, 0, ...additions)
      }

      saveAutomationProjects(updatedProjects)

      // Preserve the request reference and notes for the admin activity log.
      const logKey = "atlas360-project-admin-history"
      const history = JSON.parse(window.localStorage.getItem(logKey) || "[]")

      window.localStorage.setItem(
        logKey,
        JSON.stringify([
          {
            id: crypto.randomUUID(),
            referenceRequestNumber: reference,
            projectName: isNewProject ? projectName : existingProject!.name,
            podNames: names,
            additionalNotes: additionalNotes.trim(),
            action: isNewProject ? "Project Created" : "PODs Added",
            createdAt: new Date().toISOString(),
          },
          ...history,
        ]),
      )

      setProjectFormSuccess(
        isNewProject
          ? `Project "${projectName}" and ${names.length} POD(s) added successfully.`
          : `${names.length} POD(s) added to "${existingProject!.name}".`,
      )

      resetProjectForm()
    } catch {
      setProjectFormError("Unable to save the project changes.")
    }
  }
  const actions = [
    {
      id: "project",
      title: "Add New Project",
      subtitle: "Configure a new project for Request Center",
    },
    //{
    //id: "request",
    //title: "Add New Request to Request Center",
    //subtitle: "Configure a new request type for an existing project",
    //},
  ] as const

  const selectedIndex = actions.findIndex(
    (action) => action.id === selectedAction,
  )

  const selectedTitle =
    selectedAction === "project"
      ? "Add New Project"
      : "Add New Request to Request Center"

  const fieldClass =
    "w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2.5 text-[13px] text-[#17233D] focus:outline-none focus:ring-2 focus:ring-[#00539B]"

  const labelClass = "mb-1.5 block text-[13px] font-semibold text-[#17233D]"

  return (
    <section className="min-w-0 rounded-xl border border-[#DDE3E9] bg-white p-6 shadow-sm">
      {/* Action cards */}
      <div className="grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-2">
        {actions.map((action) => {
          const isSelected = selectedAction === action.id

          return (
            <div key={action.id} className="relative min-w-0">
              <button
                type="button"
                aria-expanded={isSelected}
                aria-controls="admin-request-center-form-panel"
                onClick={() => setSelectedAction(isSelected ? null : action.id)}
                className={`group flex min-h-[112px] w-full flex-col justify-between rounded-lg border p-3 text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00539B] ${
                  isSelected
                    ? "border-[#00539B] bg-[#F0F6FC] shadow-md ring-1 ring-[#00539B]"
                    : "border-[#DDE3E9] bg-white hover:border-[#9CB6CD] hover:bg-[#F8FBFE]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${
                      isSelected
                        ? "bg-[#003B70] text-white"
                        : "bg-[#E8F0F7] text-[#003B70]"
                    }`}
                  >
                    {action.id === "project" ? (
                      <svg
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
                        <path d="M12 11v6M9 14h6" />
                      </svg>
                    ) : (
                      <svg
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3" />
                        <path d="M8 3h6l4 4v4" />
                        <path d="M16 17h6M19 14v6" />
                      </svg>
                    )}
                  </span>

                  <div className="min-w-0">
                    <h3 className="text-[13px] font-bold text-[#17233D]">
                      {action.title}
                    </h3>
                    <p className="mt-1 text-[11px] leading-4 text-[#526174]">
                      {action.subtitle}
                    </p>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-end gap-2">
                  <span className="ml-auto text-[12px] font-semibold text-[#00539B] group-hover:underline">
                    Submit Request
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[#00539B] transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </div>
              </button>
            </div>
          )
        })}
      </div>

      {/* Connected form panel */}
      {selectedAction && (
        <div
          id="admin-request-center-form-panel"
          role="region"
          aria-label={selectedTitle}
          className="relative mt-3 rounded-xl border border-[#00539B] bg-white p-5 sm:p-6"
        >
          <span
            aria-hidden="true"
            className="absolute -top-[9px] hidden size-4 -translate-x-1/2 rotate-45 border-l border-t border-[#00539B] bg-white transition-[left] duration-300 ease-out sm:block"
            style={{
              left: `calc((100% - 12px) / 2 * ${selectedIndex} + ${
                selectedIndex * 12
              }px + (100% - 12px) / 4)`,
            }}
          />

          <h2 className="mb-5 text-[18px] font-bold text-[#17233D]">
            {selectedTitle}
          </h2>

          <form
            key={selectedAction}
            onSubmit={(event) => {
              event.preventDefault()

              if (selectedAction === "project") {
                saveProjectForm()
              }

              // Add New Request to Request Center remains unchanged.
            }}
            className="overflow-hidden rounded-xl border border-[#DDE3E9] bg-white shadow-sm"
          >
            <div className="border-b border-[#E9EDF1] px-5 py-4">
              <p className="text-[12px] text-[#526174]">
                {selectedAction === "project"
                  ? "Select an existing automation project to add PODs, or create a new project with its associated PODs."
                  : "Provide the details for the new Request Center request type."}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
              {selectedAction === "project" ? (
                <>
                  {/* Reference Request Number */}
                  <label className="block sm:col-span-2">
                    <span className={labelClass}>
                      Reference Request Number *
                    </span>
                    <input
                      type="text"
                      value={referenceRequestNumber}
                      onChange={(event) =>
                        setReferenceRequestNumber(event.target.value)
                      }
                      required
                      placeholder="e.g. OB-100001"
                      className={fieldClass}
                    />
                  </label>

                  {/* Project Selection */}
                  <label className="block sm:col-span-2">
                    <span className={labelClass}>Project Name *</span>

                    <select
                      value={selectedProjectId}
                      onChange={(event) => {
                        setSelectedProjectId(event.target.value)
                        setNewProjectName("")
                        setProjectFormError("")
                      }}
                      required
                      className={fieldClass}
                    >
                      <option value="">Select a project</option>

                      {primaryProjects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}

                      <option value="__new__">+ New Project</option>
                    </select>
                  </label>

                  {/* New Project Name */}
                  {selectedProjectId === "__new__" && (
                    <label className="block sm:col-span-2">
                      <span className={labelClass}>New Project Name *</span>
                      <input
                        type="text"
                        value={newProjectName}
                        onChange={(event) =>
                          setNewProjectName(event.target.value)
                        }
                        required
                        placeholder="Enter new project name"
                        className={fieldClass}
                      />
                    </label>
                  )}

                  {/* POD Names */}
                  <div className="sm:col-span-2">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className={labelClass}>POD Name *</span>

                      <button
                        type="button"
                        onClick={addPodField}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[12px] font-semibold text-[#00539B] hover:bg-[#E8F0F7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00539B]"
                      >
                        <span aria-hidden="true">+</span>
                        Add POD
                      </button>
                    </div>

                    <div className="space-y-3">
                      {podNames.map((pod, index) => (
                        <div key={pod.id} className="flex items-center gap-3">
                          <div className="min-w-0 flex-1">
                            <label
                              htmlFor={`admin-pod-${pod.id}`}
                              className="sr-only"
                            >
                              POD Name {index + 1}
                            </label>

                            <input
                              id={`admin-pod-${pod.id}`}
                              type="text"
                              value={pod.name}
                              onChange={(event) =>
                                updatePodField(pod.id, event.target.value)
                              }
                              required
                              placeholder={`Enter POD name ${index + 1}`}
                              className={fieldClass}
                            />
                          </div>

                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => removePodField(pod.id)}
                              className="rounded-md border border-[#F2C7C7] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#B42318] hover:bg-[#FFF1F0] disabled:opacity-40"
                              aria-label={`Delete POD ${index + 1}`}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <label className="block sm:col-span-2">
                    <span className={labelClass}>Additional Notes</span>
                    <textarea
                      value={additionalNotes}
                      onChange={(event) =>
                        setAdditionalNotes(event.target.value)
                      }
                      rows={3}
                      placeholder="Add any additional information..."
                      className={fieldClass}
                    />
                  </label>

                  {/* Validation / Success Messages */}
                  {projectFormError && (
                    <p
                      role="alert"
                      className="sm:col-span-2 text-[12px] font-medium text-[#B42318]"
                    >
                      {projectFormError}
                    </p>
                  )}

                  {projectFormSuccess && (
                    <p
                      role="status"
                      className="sm:col-span-2 text-[12px] font-semibold text-[#16765B]"
                    >
                      {projectFormSuccess}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <label className="block">
                    <span className={labelClass}>Project *</span>
                    <input
                      name="project"
                      type="text"
                      required
                      placeholder="Enter project name"
                      className={fieldClass}
                    />
                  </label>

                  <label className="block">
                    <span className={labelClass}>Request name *</span>
                    <input
                      name="requestName"
                      type="text"
                      required
                      placeholder="Enter request name"
                      className={fieldClass}
                    />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className={labelClass}>Request description</span>
                    <textarea
                      name="description"
                      rows={3}
                      placeholder="Describe the request..."
                      className={fieldClass}
                    />
                  </label>
                </>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t border-[#E9EDF1] px-5 py-4">
              <button
                type="button"
                onClick={() => setSelectedAction(null)}
                className="rounded-lg border border-[#CBD5E1] bg-white px-5 py-2.5 text-[13px] font-semibold text-[#334155] hover:bg-[#F4F6F8]"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-lg bg-[#003B70] px-6 py-2.5 text-[13px] font-semibold text-white hover:bg-[#00539B]"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}

      {selectedAction === "project" && <AutomationProjectManagement />}
    </section>
  )
}
type ProjectAdminAction = "accept" | "more" | "reject" | "approve"

function AdminProjectRequestsTable({
  requestType = "Add Project",
}: {
  requestType?: "Add Project" | "Other Requests"
}) {
  const [requests, setRequests] =
    useState<OnboardingRequest[]>(readAccessRequests)

  const [viewingRequestNumber, setViewingRequestNumber] =
    useState<string | null>(null)

  const [pendingAction, setPendingAction] = useState<{
    requestNumber: string
    action: ProjectAdminAction
  } | null>(null)

  const [adminMessage, setAdminMessage] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [rejectionDetails, setRejectionDetails] = useState("")
  const [saveError, setSaveError] = useState("")

  useEffect(() => {
    const refresh = () => setRequests(readAccessRequests())

    window.addEventListener("atlas360-onboarding-history-updated", refresh)
    window.addEventListener("storage", refresh)

    return () => {
      window.removeEventListener("atlas360-onboarding-history-updated", refresh)
      window.removeEventListener("storage", refresh)
    }
  }, [])

  const projectRequests = requests.filter(
    (request) => request.requestType === requestType,
  )

  const viewingRequest = requests.find(
    (request) => request.requestNumber === viewingRequestNumber,
  )

  const openAction = (requestNumber: string, action: ProjectAdminAction) => {
    setPendingAction({ requestNumber, action })
    setAdminMessage("")
    setRejectionReason("")
    setRejectionDetails("")
    setSaveError("")
  }

  const saveDecision = () => {
    if (!pendingAction) return

    if (pendingAction.action === "more" && !adminMessage.trim()) {
      setSaveError("Please enter the information required.")
      return
    }

    if (
      pendingAction.action === "reject" &&
      (!rejectionReason ||
        (rejectionReason === "Other" && !rejectionDetails.trim()))
    ) {
      setSaveError("Please provide a rejection reason.")
      return
    }

    const latest = readAccessRequests()
    const target = latest.find(
      (request) =>
        request.requestNumber === pendingAction.requestNumber &&
        request.requestType === requestType,
    )

    if (!target) {
      setSaveError("This request could not be found.")
      return
    }

    if (target.status === "Completed" || target.status === "Rejected") {
      setSaveError("This request has already been closed.")
      return
    }

    const changes: Partial<OnboardingRequest> = {
      reviewedAt: new Date().toISOString(),
    }

    switch (pendingAction.action) {
      case "accept":
        changes.status = "In Progress"
        break

      case "more":
        changes.status = "Need More Details"
        changes.adminMessage = adminMessage.trim()
        break

      case "reject":
        changes.status = "Rejected"
        changes.rejectionReason = rejectionReason
        changes.rejectionDetails =
          rejectionReason === "Other" ? rejectionDetails.trim() : ""
        break

      case "approve":
        changes.status = "Completed"
        break
    }

    const updated = latest.map((request) =>
      request.requestNumber === pendingAction.requestNumber
        ? { ...request, ...changes }
        : request,
    )

    try {
      window.localStorage.setItem(
        "atlas360-onboarding-requests",
        JSON.stringify(updated),
      )

      setRequests(updated)

      window.dispatchEvent(new Event("atlas360-onboarding-history-updated"))

      // NEW: Generate a notification after a successful admin update
      if (changes.status && changes.status !== target.status) {
        createAdminNotification(
          pendingAction.requestNumber,
          target.requestType,
          changes.status,
        )
      }

      setPendingAction(null)
    } catch {
      setSaveError("Unable to save changes. Please try again.")
    }
  }

  const statusColors: Record<string, string> = {
    Submitted: "bg-[#FFF4E2] text-[#95620B]",
    "In Progress": "bg-[#E8F0F7] text-[#003B70]",
    "Need More Details": "bg-[#FFF4E2] text-[#95620B]",
    Completed: "bg-[#E7F5F0] text-[#13795B]",
    Rejected: "bg-[#FDEAEA] text-[#B42318]",
  }

  const inputClass =
    "w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2.5 text-[13px] text-[#17233D] focus:outline-none focus:ring-2 focus:ring-[#00539B]"

  return (
    <section className="rounded-xl border border-[#DDE3E9] bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-bold text-[#17233D]">
            {requestType === "Other Requests"
              ? "Other Requests"
              : "Project Onboarding Requests"}{" "}
          </h2>
          <p className="mt-1 text-[12px] text-[#526174]">
            {requestType === "Other Requests"
              ? "Review additional requests and automation improvement ideas."
              : "Review and manage new project onboarding requests."}{" "}
          </p>
        </div>

        <span className="rounded-full bg-[#E8F0F7] px-3 py-1 text-[12px] font-semibold text-[#003B70]">
          {projectRequests.length} Requests
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] text-left">
          <thead className="border-b border-[#DDE3E9] bg-[#F8FAFC]">
            <tr>
              {(requestType === "Other Requests"
                ? [
                    "Requestor's Name",
                    "Project Name",
                    "What is the Request",
                    "Date",
                    "Status",
                    "Actions",
                  ]
                : [
                    "Request Number",
                    "Project Name",
                    "POD Name",
                    "Requestor's Name",
                    "Date",
                    "Status",
                    "Actions",
                  ]
              ).map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className="px-3 py-3 text-[12px] font-semibold text-[#526174]"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {projectRequests.map((request) => {
              const closed =
                request.status === "Completed" || request.status === "Rejected"

              return (
                <tr
                  key={request.requestNumber}
                  className="border-b border-[#E9EDF1] hover:bg-[#F8FBFE]"
                >
                  {requestType === "Other Requests" ? (
                    <>
                      <td className="px-3 py-3">
                        <button
                          type="button"
                          onClick={() =>
                            setViewingRequestNumber(request.requestNumber)
                          }
                          title={`View ${request.requestNumber}`}
                          className="text-left text-[12px] font-semibold text-[#00539B] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00539B]"
                        >
                          {request.details?.requestorName || "—"}
                        </button>
                      </td>

                      <td className="px-3 py-3 text-[12px] text-[#34415B]">
                        {request.details?.project || "—"}
                      </td>

                      <td className="max-w-[320px] px-3 py-3 text-[12px] text-[#34415B]">
                        <span
                          className="block truncate"
                          title={request.details?.requestDescription || ""}
                        >
                          {request.details?.requestDescription || "—"}
                        </span>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-3 py-3">
                        <button
                          type="button"
                          onClick={() =>
                            setViewingRequestNumber(request.requestNumber)
                          }
                          className="text-[12px] font-semibold text-[#00539B] hover:underline"
                        >
                          {request.requestNumber}
                        </button>
                      </td>

                      <td className="px-3 py-3 text-[12px] text-[#34415B]">
                        {request.details?.projectName || "—"}
                      </td>

                      <td className="px-3 py-3 text-[12px] text-[#34415B]">
                        {request.details?.podName || "—"}
                      </td>

                      <td className="px-3 py-3 text-[12px] text-[#34415B]">
                        {request.details?.requestorName || "—"}
                      </td>
                    </>
                  )}

                  <td className="px-3 py-3 text-[12px] text-[#34415B]">
                    {request.submissionDate}
                  </td>

                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold ${
                        statusColors[request.status] ??
                        "bg-[#F1F5F9] text-[#475569]"
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>

                  <td className="px-3 py-3">
                    {closed ? (
                      <span className="text-[11px] text-[#64748B]">
                        Reviewed
                      </span>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2">
                        {request.status !== "In Progress" && (
                          <button
                            type="button"
                            onClick={() =>
                              openAction(request.requestNumber, "accept")
                            }
                            className="rounded-lg border border-[#00539B] bg-[#E8F0F7] px-3 py-1.5 text-[11px] font-semibold text-[#003B70] hover:bg-[#D7E7F5]"
                          >
                            Accept
                          </button>
                        )}

                        {request.status === "In Progress" && (
                          <button
                            type="button"
                            onClick={() =>
                              openAction(request.requestNumber, "approve")
                            }
                            className="rounded-lg border border-[#13795B] bg-[#E7F5F0] px-3 py-1.5 text-[11px] font-semibold text-[#13795B] hover:bg-[#D4EEE4]"
                          >
                            Approve
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            openAction(request.requestNumber, "more")
                          }
                          className="rounded-lg border border-[#D6A24A] bg-[#FFF4E2] px-3 py-1.5 text-[11px] font-semibold text-[#95620B] hover:bg-[#FCE8C5]"
                        >
                          Need More Details
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            openAction(request.requestNumber, "reject")
                          }
                          className="rounded-lg border border-[#B42318] bg-[#FDEAEA] px-3 py-1.5 text-[11px] font-semibold text-[#B42318] hover:bg-[#FBDADA]"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {projectRequests.length === 0 && (
          <div className="py-12 text-center text-[13px] text-[#64748B]">
            No project onboarding requests have been submitted yet.
          </div>
        )}
      </div>

      {/* Request details dialog */}
      {viewingRequest && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F172A]/60 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-details-title"
            className="flex max-h-[90vh] w-full max-w-[680px] flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between bg-[#003B70] px-6 py-4">
              <div>
                <h2
                  id="project-details-title"
                  className="text-[18px] font-bold text-white"
                >
                  {requestType === "Other Requests"
                    ? "Other Request Details"
                    : "Project Onboarding Request"}{" "}
                </h2>
                <p className="mt-1 text-[12px] text-white/80">
                  {viewingRequest.requestNumber}
                </p>
              </div>

              <button
                type="button"
                aria-label="Close request details"
                onClick={() => setViewingRequestNumber(null)}
                className="rounded-lg p-2 text-white hover:bg-white/20"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto p-6">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[12px] text-[#526174]">
                  Submitted {viewingRequest.submissionDate}
                </span>
                <HistoryStatusBadge status={viewingRequest.status} />
              </div>

              <h3 className="mb-3 border-b border-[#E9EDF1] pb-2 text-[14px] font-bold text-[#17233D]">
                Submitted Details
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {Object.entries(viewingRequest.details || {}).map(
                  ([key, value]) => (
                    <div key={key} className="min-w-0">
                      <p className="text-[11px] font-medium text-[#64748B]">
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (letter) => letter.toUpperCase())}
                      </p>
                      <p className="mt-1 whitespace-pre-wrap break-words text-[13px] font-semibold text-[#17233D]">
                        {String(value || "—")}
                      </p>
                    </div>
                  ),
                )}
              </div>

              {viewingRequest.adminMessage && (
                <div className="mt-6 rounded-lg border border-[#E6C98D] bg-[#FFF9ED] p-4">
                  <h3 className="text-[13px] font-bold text-[#95620B]">
                    Additional Information Requested
                  </h3>
                  <p className="mt-2 whitespace-pre-wrap text-[12px] text-[#34415B]">
                    {viewingRequest.adminMessage}
                  </p>
                </div>
              )}

              {viewingRequest.rejectionReason && (
                <div className="mt-6 rounded-lg border border-[#F5C2C0] bg-[#FFF4F2] p-4">
                  <h3 className="text-[13px] font-bold text-[#B42318]">
                    Rejection Reason
                  </h3>
                  <p className="mt-2 text-[12px] text-[#34415B]">
                    {viewingRequest.rejectionReason}
                  </p>

                  {viewingRequest.rejectionDetails && (
                    <p className="mt-2 whitespace-pre-wrap text-[12px] text-[#34415B]">
                      {viewingRequest.rejectionDetails}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end border-t border-[#E9EDF1] px-6 py-4">
              <button
                type="button"
                onClick={() => setViewingRequestNumber(null)}
                className="rounded-lg bg-[#003B70] px-5 py-2.5 text-[12px] font-semibold text-white hover:bg-[#00539B]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin action dialog */}
      {pendingAction && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#0F172A]/60 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-action-title"
            className="w-full max-w-[500px] overflow-hidden rounded-xl bg-white shadow-2xl"
          >
            <div className="bg-[#003B70] px-6 py-4">
              <h2
                id="project-action-title"
                className="text-[17px] font-bold text-white"
              >
                {pendingAction.action === "more"
                  ? "Request More Details"
                  : pendingAction.action === "reject"
                    ? `Reject ${
                        requestType === "Other Requests" ? "Other" : "Project"
                      } Request`
                    : pendingAction.action === "approve"
                      ? `Approve ${
                          requestType === "Other Requests" ? "Other" : "Project"
                        } Request`
                      : `Accept ${
                          requestType === "Other Requests" ? "Other" : "Project"
                        } Request`}
              </h2>
              <p className="mt-1 text-[12px] text-white/80">
                {pendingAction.requestNumber}
              </p>
            </div>

            <div className="space-y-4 p-6">
              {pendingAction.action === "more" && (
                <label className="block">
                  <span className="mb-2 block text-[13px] font-semibold text-[#17233D]">
                    Information Required *
                  </span>
                  <textarea
                    value={adminMessage}
                    onChange={(event) => setAdminMessage(event.target.value)}
                    rows={5}
                    placeholder="Explain what additional information is needed..."
                    className={inputClass}
                  />
                </label>
              )}

              {pendingAction.action === "reject" && (
                <>
                  <label className="block">
                    <span className="mb-2 block text-[13px] font-semibold text-[#17233D]">
                      Rejection Reason *
                    </span>

                    <select
                      value={rejectionReason}
                      onChange={(event) => {
                        setRejectionReason(event.target.value)
                        setRejectionDetails("")
                      }}
                      className={inputClass}
                    >
                      <option value="">Select a reason</option>
                      <option value="Incomplete Information">
                        Incomplete Information
                      </option>
                      <option value="Duplicate Project">
                        Duplicate Project
                      </option>
                      <option value="Repository Not Accessible">
                        Repository Not Accessible
                      </option>
                      <option value="Project Not Eligible">
                        Project Not Eligible
                      </option>
                      <option value="Other">Other</option>
                    </select>
                  </label>

                  {rejectionReason === "Other" && (
                    <label className="block">
                      <span className="mb-2 block text-[13px] font-semibold text-[#17233D]">
                        Please Specify *
                      </span>
                      <textarea
                        value={rejectionDetails}
                        onChange={(event) =>
                          setRejectionDetails(event.target.value)
                        }
                        rows={4}
                        placeholder="Enter the rejection reason..."
                        className={inputClass}
                      />
                    </label>
                  )}
                </>
              )}

              {pendingAction.action === "accept" && (
                <p className="text-[13px] text-[#34415B]">
                  Accepting this request will change its status to{" "}
                  <strong>In Progress</strong>.
                </p>
              )}

              {pendingAction.action === "approve" && (
                <p className="text-[13px] text-[#34415B]">
                  Approving this request will change its status to{" "}
                  <strong>Completed</strong>.
                </p>
              )}

              {saveError && (
                <p role="alert" className="text-[12px] text-[#B42318]">
                  {saveError}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t border-[#E9EDF1] px-6 py-4">
              <button
                type="button"
                onClick={() => setPendingAction(null)}
                className="rounded-lg border border-[#CBD5E1] bg-white px-4 py-2.5 text-[12px] font-semibold text-[#334155] hover:bg-[#F4F6F8]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveDecision}
                className={`rounded-lg px-5 py-2.5 text-[12px] font-semibold text-white ${
                  pendingAction.action === "reject"
                    ? "bg-[#B42318] hover:bg-[#912018]"
                    : "bg-[#003B70] hover:bg-[#00539B]"
                }`}
              >
                {pendingAction.action === "more"
                  ? "Send"
                  : pendingAction.action === "reject"
                    ? "Submit"
                    : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function AdminAccessRequestsTable() {
  const [requests, setRequests] =
    useState<OnboardingRequest[]>(readAccessRequests)

  const [pendingAction, setPendingAction] = useState<{
    requestNumber: string
    decision: "approve" | "reject"
  } | null>(null)

  useEffect(() => {
    const refresh = () => setRequests(readAccessRequests())

    window.addEventListener(ACCESS_REQUEST_UPDATED_EVENT, refresh)
    window.addEventListener("storage", refresh)

    return () => {
      window.removeEventListener(ACCESS_REQUEST_UPDATED_EVENT, refresh)
      window.removeEventListener("storage", refresh)
    }
  }, [])

  const accessRequests = requests.filter(
    (request) =>
      request.requestType === "Request Access" ||
      request.requestType === "Revoke Access",
  )

  const handleDecision = () => {
    if (!pendingAction) return

    const latestRequests = readAccessRequests()

    const target = latestRequests.find(
      (request) => request.requestNumber === pendingAction.requestNumber,
    )

    if (!target || target.status !== "Submitted") {
      setRequests(latestRequests)
      setPendingAction(null)
      return
    }

    const newStatus =
      pendingAction.decision === "approve" ? "Completed" : "Rejected"

    const updated = latestRequests.map((request) =>
      request.requestNumber === pendingAction.requestNumber
        ? {
            ...request,
            status: newStatus,
          }
        : request,
    )

    try {
      window.localStorage.setItem(
        ACCESS_REQUEST_STORAGE_KEY,
        JSON.stringify(updated),
      )

      setRequests(updated)

      window.dispatchEvent(new Event(ACCESS_REQUEST_UPDATED_EVENT))

      // Notify when an access request is approved or rejected
      createAdminNotification(
        target.requestNumber,
        target.requestType,
        newStatus,
      )

      setPendingAction(null)
    } catch {
      window.alert("Unable to save the decision. Please try again.")
    }
  }

  return (
    <section className="rounded-xl border border-[#DDE3E9] bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-bold text-[#17233D]">
            Access Requests
          </h2>
          <p className="mt-1 text-[12px] text-[#526174]">
            Review requests to grant or revoke automation project access.
          </p>
        </div>

        <span className="rounded-full bg-[#E8F0F7] px-3 py-1 text-[12px] font-semibold text-[#003B70]">
          {accessRequests.length} Requests
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-left">
          <thead className="border-b border-[#DDE3E9] bg-[#F8FAFC]">
            <tr>
              {[
                "Request Number",
                "Requestor's Name",
                "Type",
                "Time",
                "Status",
                "Actions",
              ].map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className="px-4 py-3 text-[12px] font-semibold text-[#526174]"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {accessRequests.map((request) => {
              const isPending = request.status === "Submitted"

              return (
                <tr
                  key={request.requestNumber}
                  className="border-b border-[#E9EDF1] hover:bg-[#F8FBFE]"
                >
                  <td className="px-4 py-3 text-[12px] font-semibold text-[#00539B]">
                    {request.requestNumber}
                  </td>

                  <td className="px-4 py-3 text-[12px] text-[#34415B]">
                    {request.details?.requestorName || "—"}
                  </td>

                  <td className="px-4 py-3 text-[12px] text-[#34415B]">
                    {request.requestType}
                  </td>

                  <td className="px-4 py-3 text-[12px] text-[#34415B]">
                    {request.submissionDate}
                  </td>

                  <td className="px-4 py-3">
                    <HistoryStatusBadge status={request.status} />
                  </td>

                  <td className="px-4 py-3">
                    {isPending ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setPendingAction({
                              requestNumber: request.requestNumber,
                              decision: "approve",
                            })
                          }
                          className="rounded-lg border border-[#13795B] bg-[#E7F5F0] px-3 py-1.5 text-[11px] font-semibold text-[#13795B] hover:bg-[#D4EEE4]"
                        >
                          Approve
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setPendingAction({
                              requestNumber: request.requestNumber,
                              decision: "reject",
                            })
                          }
                          className="rounded-lg border border-[#B42318] bg-[#FDEAEA] px-3 py-1.5 text-[11px] font-semibold text-[#B42318] hover:bg-[#FBDADA]"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-[#64748B]">
                        Reviewed
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {accessRequests.length === 0 && (
          <div className="py-12 text-center text-[13px] text-[#64748B]">
            No access requests have been submitted yet.
          </div>
        )}
      </div>

      {pendingAction && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F172A]/60 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="access-decision-title"
            aria-describedby="access-decision-description"
            className="w-full max-w-[440px] overflow-hidden rounded-xl bg-white shadow-2xl"
          >
            <div className="bg-[#003B70] px-5 py-4">
              <h2
                id="access-decision-title"
                className="text-[17px] font-bold text-white"
              >
                Confirm{" "}
                {pendingAction.decision === "approve"
                  ? "Approval"
                  : "Rejection"}
              </h2>
            </div>

            <div className="p-5">
              <p
                id="access-decision-description"
                className="text-[13px] text-[#34415B]"
              >
                Are you sure you want to{" "}
                {pendingAction.decision === "approve" ? "approve" : "reject"}{" "}
                request <strong>{pendingAction.requestNumber}</strong>?
              </p>

              <p className="mt-2 text-[12px] text-[#64748B]">
                This decision will also update the user's Onboarding Request
                History.
              </p>
            </div>

            <div className="flex justify-end gap-3 border-t border-[#E9EDF1] px-5 py-4">
              <button
                type="button"
                onClick={() => setPendingAction(null)}
                className="rounded-lg border border-[#CBD5E1] bg-white px-4 py-2 text-[12px] font-semibold text-[#334155]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDecision}
                className={`rounded-lg px-4 py-2 text-[12px] font-semibold text-white ${
                  pendingAction.decision === "approve"
                    ? "bg-[#13795B] hover:bg-[#0F6048]"
                    : "bg-[#B42318] hover:bg-[#912018]"
                }`}
              >
                Confirm{" "}
                {pendingAction.decision === "approve"
                  ? "Approval"
                  : "Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function AdminOperationsPage({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] =
    useState<"Onboarding Requests" | "Automation Project Management">(
      "Onboarding Requests",
    )

  const tabs = ["Onboarding Requests", "Automation Project Management"] as const

  return (
    <div className="w-full">
      <div className="mb-6">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to main page"
          className="mb-3 flex h-9 w-11 items-center justify-center rounded-lg bg-[#003B70] text-white transition hover:bg-[#00539B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00539B]"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <h1 className="text-2xl font-bold text-[#17233D]">Admin Operations</h1>
        <p className="mt-1 text-sm text-[#526174]">
          Administrative tools and operations
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#DDE3E9] bg-white">
        <div
          role="tablist"
          aria-label="Admin Operations"
          className="flex border-b border-[#DDE3E9]"
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              id={`admin-tab-${tab}`}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              aria-controls={`admin-panel-${tab}`}
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 px-6 py-4 text-sm font-semibold transition-colors ${
                activeTab === tab
                  ? "border-[#00539B] text-[#00539B]"
                  : "border-transparent text-[#526174] hover:bg-[#F8FBFE] hover:text-[#003B70]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div
          id={`admin-panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`admin-tab-${activeTab}`}
          className="p-4 sm:p-6"
        >
          {activeTab === "Onboarding Requests" ? (
            <div className="space-y-6">
              <AdminProjectRequestsTable />
              <AdminAccessRequestsTable />
              <AdminProjectRequestsTable requestType="Other Requests" />
            </div>
          ) : (
            <AdminRequestCenterTab />
          )}
        </div>
      </div>
    </div>
  )
}

function RequestHistoryPage({
  onBack,
  initialTab = "requestCenter",
}: {
  onBack: () => void
  initialTab?: "requestCenter" | "automation" | "onboarding"
}) {
  const [activeHistoryTab, setActiveHistoryTab] =
    useState<"requestCenter" | "automation" | "onboarding">(initialTab)
  useEffect(() => {
    setActiveHistoryTab(initialTab)
  }, [initialTab])
  const [historySearch, setHistorySearch] = useState("")
  const [requestCenterHistory, setRequestCenterHistory] =
    useState<RequestCenterHistoryRecord[]>(() => [
      ...getRequestCenterHistory(),
      ...DEMO_REQUEST_CENTER_HISTORY,
    ])
  const [onboardingSearch, setOnboardingSearch] = useState("")

  const [onboardingHistory, setOnboardingHistory] =
    useState<OnboardingRequest[]>(() => [
      ...getOnboardingHistory(),
      ...DEMO_ONBOARDING_HISTORY,
    ])

  const [viewingOnboardingRequest, setViewingOnboardingRequest] =
    useState<OnboardingRequest | null>(null)
  useEffect(() => {
    if (!viewingOnboardingRequest) return

    const updatedRequest = onboardingHistory.find(
      (request) =>
        request.requestNumber === viewingOnboardingRequest.requestNumber,
    )

    if (updatedRequest && updatedRequest !== viewingOnboardingRequest) {
      setViewingOnboardingRequest(updatedRequest)
    }
  }, [onboardingHistory, viewingOnboardingRequest])
  const [automationSearch, setAutomationSearch] = useState("")

  const [automationHistory, setAutomationHistory] =
    useState<AutomationHistoryRecord[]>(() => [
      ...getAutomationHistory(),
      ...DEMO_AUTOMATION_HISTORY,
    ])

  const filteredAutomationHistory = automationHistory.filter((record) =>
    [
      record.project,
      record.type,
      record.suite,
      record.status,
      record.submittedOn,
      new Date(record.submittedOn).toLocaleString("en-US"),
    ].some((value) =>
      String(value ?? "")
        .toLowerCase()
        .includes(automationSearch.trim().toLowerCase()),
    ),
  )
  useEffect(() => {
    const refreshAutomationHistory = () => {
      setAutomationHistory([
        ...getAutomationHistory(),
        ...DEMO_AUTOMATION_HISTORY,
      ])
    }

    window.addEventListener(
      "atlas360-automation-history-updated",
      refreshAutomationHistory,
    )
    window.addEventListener("storage", refreshAutomationHistory)

    return () => {
      window.removeEventListener(
        "atlas360-automation-history-updated",
        refreshAutomationHistory,
      )
      window.removeEventListener("storage", refreshAutomationHistory)
    }
  }, [])
  const filteredOnboardingHistory = onboardingHistory.filter((request) =>
    [
      request.requestNumber,
      request.requestType,
      request.status,
      request.details.projectName,
      request.details.project,
      request.details.podName,
      request.details.pod,
      request.submissionDate,
    ].some((value) =>
      String(value ?? "")
        .toLowerCase()
        .includes(onboardingSearch.trim().toLowerCase()),
    ),
  )
  const filteredRequestCenterHistory = requestCenterHistory.filter((record) =>
    [
      record.requestNumber,
      record.requestType,
      record.status,
      record.environment,
      record.submittedOn,
      record.orderNumber,
    ].some((value) =>
      String(value ?? "")
        .toLowerCase()
        .includes(historySearch.trim().toLowerCase()),
    ),
  )

  useEffect(() => {
    const refreshHistory = () => {
      setRequestCenterHistory([
        ...getRequestCenterHistory(),
        ...DEMO_REQUEST_CENTER_HISTORY,
      ])
    }

    window.addEventListener("atlas360-request-history-updated", refreshHistory)
    window.addEventListener("storage", refreshHistory)

    return () => {
      window.removeEventListener(
        "atlas360-request-history-updated",
        refreshHistory,
      )
      window.removeEventListener("storage", refreshHistory)
    }
  }, [])
  useEffect(() => {
    const refreshOnboardingHistory = () => {
      setOnboardingHistory([
        ...getOnboardingHistory(),
        ...DEMO_ONBOARDING_HISTORY,
      ])
    }

    window.addEventListener(
      "atlas360-onboarding-history-updated",
      refreshOnboardingHistory,
    )
    window.addEventListener("storage", refreshOnboardingHistory)

    return () => {
      window.removeEventListener(
        "atlas360-onboarding-history-updated",
        refreshOnboardingHistory,
      )
      window.removeEventListener("storage", refreshOnboardingHistory)
    }
  }, [])
  const historyTabs = [
    { id: "requestCenter", label: "Request Center History" },
    { id: "automation", label: "Automation Test History" },
    { id: "onboarding", label: "Onboarding History" },
  ] as const

  return (
    <div className="pb-10">
      {/* Back navigation */}
      <button
        type="button"
        onClick={onBack}
        aria-label="Back to ATLAS360"
        title="Back to ATLAS360"
        className="
    mb-3 inline-flex
    h-9 w-11
    items-center justify-center
    rounded-lg
    bg-[#003B70] text-white
    shadow-sm
    transition-all duration-200
    hover:bg-[#00539B]
    hover:shadow-md
    active:scale-95
    focus-visible:outline
    focus-visible:outline-2
    focus-visible:outline-offset-2
    focus-visible:outline-[#00539B]
  "
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </svg>
      </button>

      {/* Page heading */}
      <div className="mb-7">
        <h1 className="text-[28px] font-bold text-[#13203D] sm:text-[34px]">
          Request History
        </h1>
      </div>

      {/* Main container */}
      <section
        className="min-h-[350px] overflow-hidden rounded-xl border border-[#DDE3E9] bg-white shadow-sm"
        aria-label="Request History"
      >
        {/* Tabs */}
        <div
          className="flex overflow-x-auto border-b border-[#DDE3E9] px-5"
          role="tablist"
          aria-label="Request history categories"
        >
          {historyTabs.map((tab) => {
            const selected = activeHistoryTab === tab.id

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`history-tab-${tab.id}`}
                aria-selected={selected}
                aria-controls={`history-panel-${tab.id}`}
                onClick={() => setActiveHistoryTab(tab.id)}
                className={`relative shrink-0 whitespace-nowrap px-5 py-4 text-[13px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#00539B] ${
                  selected
                    ? "text-[#003B70]"
                    : "text-[#667085] hover:text-[#003B70]"
                }`}
              >
                {tab.label}

                {/* Active tab underline */}
                {selected && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-full bg-[#00539B]"
                    aria-hidden="true"
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Tab content */}

        {historyTabs.map((tab) =>
          activeHistoryTab === tab.id ? (
            <div
              key={tab.id}
              id={`history-panel-${tab.id}`}
              role="tabpanel"
              aria-labelledby={`history-tab-${tab.id}`}
              className="min-h-[280px] p-5 sm:p-6"
            >
              {/* Request Center History */}
              {tab.id === "requestCenter" && (
                <div>
                  {/* Search - aligned right */}
                  <div className="mb-4 flex justify-end">
                    <div className="relative w-full sm:w-[260px]">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]"
                      >
                        <circle cx="11" cy="11" r="7" />
                        <path d="m20 20-4-4" />
                      </svg>

                      <input
                        type="search"
                        aria-label="Search request history"
                        placeholder="Search requests"
                        value={historySearch}
                        onChange={(e) => setHistorySearch(e.target.value)}
                        className="h-9 w-full rounded-lg border border-[#B8C5D3] bg-white py-2 pl-9 pr-3 text-[12px] text-[#17233D] placeholder:text-[#667085] focus:border-[#00539B] focus:outline-none focus:ring-2 focus:ring-[#00539B]/15"
                      />
                    </div>
                  </div>

                  {/* Request Center History table */}
                  <div className="overflow-visible rounded-lg border border-[#DDE3E9]">
                    {" "}
                    <table className="w-full min-w-[850px] border-collapse text-left">
                      <thead className="bg-[#F4F8FC]">
                        <tr className="bg-[#F4F8FC] text-[11px] font-bold uppercase tracking-[0.13em] text-[#526174]">
                          {[
                            "Request Number",
                            "Request Type",
                            "Status",
                            "Environment",
                            "Submitted On",
                            "Order Number",
                          ].map((heading) => (
                            <th
                              key={heading}
                              scope="col"
                              className="border-b border-[#DDE3E9] px-4 py-3 text-[11px] font-bold text-[#526174]"
                            >
                              {heading}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {filteredRequestCenterHistory.map((record) => (
                          <tr
                            key={record.requestNumber}
                            className="border-b border-[#E9EDF1] last:border-b-0 hover:bg-[#F8FAFC]"
                          >
                            <td className="px-4 py-3 text-[12px] font-semibold text-[#00539B]">
                              {record.requestNumber}
                            </td>

                            <td className="px-4 py-3 text-[12px] text-[#34445C]">
                              {record.requestType}
                            </td>

                            <td className="px-4 py-3">
                              <HistoryStatusBadge status={record.status} />
                            </td>

                            <td className="px-4 py-3 text-[12px] text-[#34445C]">
                              {record.environment}
                            </td>

                            <td className="px-4 py-3">
                              <HistoryDateTime value={record.submittedOn} />
                            </td>

                            <td className="px-4 py-3 text-[12px] text-[#34445C]">
                              {record.orderNumber || "—"}
                            </td>
                          </tr>
                        ))}

                        {filteredRequestCenterHistory.length === 0 && (
                          <tr>
                            <td
                              colSpan={6}
                              className="px-4 py-12 text-center text-[12px] text-[#667085]"
                            >
                              No requests submitted yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Automation Test History - Empty for now */}

              {/* Automation Test History */}
              {tab.id === "automation" && (
                <div>
                  {/* Search */}
                  <div className="mb-4 flex justify-end">
                    <div className="relative w-full sm:w-[260px]">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]"
                      >
                        <circle cx="11" cy="11" r="7" />
                        <path d="m20 20-4-4" />
                      </svg>

                      <input
                        type="search"
                        aria-label="Search automation test history"
                        placeholder="Search automation tests"
                        value={automationSearch}
                        onChange={(e) => setAutomationSearch(e.target.value)}
                        className="h-9 w-full rounded-lg border border-[#B8C5D3] bg-white py-2 pl-9 pr-3 text-[12px] text-[#17233D] placeholder:text-[#667085] focus:border-[#00539B] focus:outline-none focus:ring-2 focus:ring-[#00539B]/15"
                      />
                    </div>
                  </div>

                  {/* History Table */}
                  <div className="overflow-visible rounded-lg border border-[#DDE3E9]">
                    {" "}
                    <table className="w-full min-w-[850px] border-collapse text-left">
                      <thead className="bg-[#F4F8FC]">
                        <tr className="bg-[#F4F8FC] text-[11px] font-bold uppercase tracking-[0.13em] text-[#526174]">
                          {[
                            "Project",
                            "Type",
                            "Suite",
                            "Status",
                            "Submitted On",
                            "Report",
                          ].map((heading) => (
                            <th
                              key={heading}
                              scope="col"
                              className={`border-b border-[#DDE3E9] px-4 py-3 text-[11px] font-bold text-[#526174] ${
                                heading === "Report"
                                  ? "text-center"
                                  : "text-left"
                              }`}
                            >
                              {heading}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {filteredAutomationHistory.map((record) => (
                          <tr
                            key={record.id}
                            className="relative z-0 border-b border-[#E9EDF1] last:border-b-0 hover:z-20 hover:bg-[#F8FAFC]"
                          >
                            {/* Project */}
                            <td className="px-4 py-3 text-[12px] font-semibold text-[#17233D]">
                              {record.project}
                            </td>

                            {/* Type */}
                            <td className="px-4 py-3 text-[12px] text-[#34445C]">
                              {record.type}
                            </td>

                            {/* Suite */}
                            <td className="px-4 py-3 text-[12px] text-[#34445C]">
                              <div className="flex flex-col gap-1">
                                {String(record.suite)
                                  .split(",")
                                  .map((suite) => suite.trim())
                                  .filter(Boolean)
                                  .map((suite, index) => (
                                    <span key={index} className="block">
                                      {suite}
                                    </span>
                                  ))}
                              </div>
                            </td>

                            {/* Status */}
                            <td className="px-4 py-3">
                              <HistoryStatusBadge status={record.status} />
                            </td>

                            {/* Submitted On */}
                            <td className="px-4 py-3">
                              <HistoryDateTime value={record.submittedOn} />
                            </td>

                            {/* Report */}
                            <td className="relative overflow-visible px-4 py-3">
                              <div className="relative z-10 flex flex-col items-center gap-2 overflow-visible">
                                <PriorityReport
                                  results={
                                    record.results ?? EMPTY_PRIORITY_RESULTS
                                  }
                                />

                                <a
                                  href={record.reportUrl}
                                  className="inline-flex items-center gap-1.5 rounded-md text-[12px] font-bold text-[#00539B] underline-offset-4 transition hover:text-[#003B70] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00539B]"
                                >
                                  View Report
                                  <ExternalLinkIcon className="size-3.5" />
                                </a>
                              </div>
                            </td>
                          </tr>
                        ))}

                        {filteredAutomationHistory.length === 0 && (
                          <tr>
                            <td
                              colSpan={6}
                              className="px-4 py-12 text-center text-[12px] text-[#667085]"
                            >
                              {automationSearch.trim()
                                ? "No matching automation tests found."
                                : "No automation tests submitted yet."}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Onboarding History - Empty for now */}

              {/* Onboarding History */}
              {tab.id === "onboarding" && (
                <div>
                  {/* Search - aligned right */}
                  <div className="mb-4 flex justify-end">
                    <div className="relative w-full sm:w-[260px]">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]"
                      >
                        <circle cx="11" cy="11" r="7" />
                        <path d="m20 20-4-4" />
                      </svg>

                      <input
                        type="search"
                        aria-label="Search onboarding history"
                        placeholder="Search onboarding requests"
                        value={onboardingSearch}
                        onChange={(e) => setOnboardingSearch(e.target.value)}
                        className="h-9 w-full rounded-lg border border-[#B8C5D3] bg-white py-2 pl-9 pr-3 text-[12px] text-[#17233D] placeholder:text-[#667085] focus:border-[#00539B] focus:outline-none focus:ring-2 focus:ring-[#00539B]/15"
                      />
                    </div>
                  </div>

                  {/* Onboarding History Table */}
                  <div className="overflow-x-auto rounded-lg border border-[#DDE3E9]">
                    <table className="w-full min-w-[850px] border-collapse text-left">
                      <thead className="bg-[#F4F8FC]">
                        <tr className="bg-[#F4F8FC]  text-[11px] font-bold uppercase tracking-[0.13em] text-[#526174]">
                          {[
                            "Request Number",
                            "Request Type",
                            "Status",
                            "Project",
                            "POD",
                            "Submission Date",
                          ].map((heading) => (
                            <th
                              key={heading}
                              scope="col"
                              className="border-b border-[#DDE3E9] px-4 py-3 text-[11px] font-bold text-[#526174]"
                            >
                              {heading}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {filteredOnboardingHistory.map((request) => (
                          <tr
                            key={request.requestNumber}
                            className="border-b border-[#E9EDF1] last:border-b-0 hover:bg-[#F8FAFC]"
                          >
                            {/* Request Number */}
                            <td className="px-4 py-3">
                              <button
                                type="button"
                                onClick={() =>
                                  setViewingOnboardingRequest(request)
                                }
                                className="text-[12px] font-semibold text-[#00539B] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00539B]"
                              >
                                {request.requestNumber}
                              </button>
                            </td>

                            {/* Request Type */}
                            <td className="px-4 py-3 text-[12px] text-[#34445C]">
                              {request.requestType}
                            </td>

                            {/* Status */}
                            <td className="px-4 py-3">
                              <HistoryStatusBadge status={request.status} />
                            </td>

                            {/* Project */}
                            <td className="px-4 py-3 text-[12px] text-[#34445C]">
                              {request.details?.projectName ||
                                request.details?.project ||
                                "—"}
                            </td>

                            {/* POD */}
                            <td className="px-4 py-3 text-[12px] text-[#34445C]">
                              {request.details?.podName ||
                                request.details?.pod ||
                                "—"}
                            </td>

                            {/* Submission Date */}
                            <td className="px-4 py-3">
                              <HistoryDateTime value={request.submissionDate} />
                            </td>
                          </tr>
                        ))}

                        {filteredOnboardingHistory.length === 0 && (
                          <tr>
                            <td
                              colSpan={6}
                              className="px-4 py-12 text-center text-[12px] text-[#667085]"
                            >
                              {onboardingSearch.trim()
                                ? "No matching onboarding requests found."
                                : "No onboarding requests submitted yet."}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : null,
        )}
      </section>
      {viewingOnboardingRequest && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-[#0F172A]/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget)
              setViewingOnboardingRequest(null)
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="onboarding-request-dialog-title"
            className="w-full max-w-[580px] overflow-hidden rounded-xl bg-white shadow-2xl"
          >
            <div className="atlas-modal-header">
              {" "}
              <div>
                <h2
                  id="onboarding-request-dialog-title"
                  className="text-[18px] font-bold text-white"
                >
                  {viewingOnboardingRequest.requestType}
                </h2>
                <p className="mt-1 break-all text-[12px] text-[#D9E8F5]">
                  Request {viewingOnboardingRequest.requestNumber}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close request details"
                title="Close"
                onClick={() => setViewingOnboardingRequest(null)}
                className="atlas-dialog-close atlas-dialog-close--light"
              >
                ×
              </button>
            </div>
            <div className="max-h-[70vh] space-y-5 overflow-y-auto px-6 py-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-[11px] font-semibold text-[#687386]">
                    Status
                  </p>
                  <p className="mt-1 text-[13px] font-semibold text-[#17233D]">
                    {viewingOnboardingRequest.status}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#687386]">
                    Submission Date
                  </p>
                  <p className="mt-1 text-[13px] text-[#17233D]">
                    {viewingOnboardingRequest.submissionDate}
                  </p>
                </div>
              </div>
              <div className="border-t border-[#E9EDF1] pt-4">
                <h3 className="mb-3 text-[13px] font-bold text-[#17233D]">
                  Request Details
                </h3>
                {Object.entries(viewingOnboardingRequest.details ?? {})
                  .length ? (
                  <dl className="space-y-4">
                    {Object.entries(viewingOnboardingRequest.details ?? {}).map(
                      ([key, value]) => (
                        <div key={key}>
                          <dt className="text-[11px] font-semibold text-[#687386]">
                            {({
                              projectName: "Project name",
                              podName: "POD name",
                              githubRepo: "GitHub repository link",
                              lastRunDetails: "Last run details with report",
                              techStack: "Automation suite tech stack",
                              additionalDetails: "Additional details",
                              requestorName: "Requestor's Name",
                              requestingFor: "Requesting for",
                              project: "Project",
                              pod: "POD",
                              businessJustification: "Business justification",
                            } as Record<string, string>)[key] ?? key}
                          </dt>
                          <dd className="mt-1 whitespace-pre-wrap break-words text-[13px] text-[#17233D]">
                            {String(value) || "—"}
                          </dd>
                        </div>
                      ),
                    )}
                  </dl>
                ) : (
                  <p className="text-[12px] text-[#687386]">
                    Details were not saved for this request.
                  </p>
                )}
              </div>

              {/* Admin requested additional information */}
              {viewingOnboardingRequest.adminMessage && (
                <div className="rounded-lg border border-[#E6C98D] bg-[#FFF9ED] p-4">
                  <h3 className="text-[13px] font-bold text-[#95620B]">
                    Additional Information Requested
                  </h3>

                  <p className="mt-2 whitespace-pre-wrap break-words text-[12px] text-[#34415B]">
                    {viewingOnboardingRequest.adminMessage}
                  </p>
                </div>
              )}

              {/* Admin rejection reason */}
              {viewingOnboardingRequest.rejectionReason && (
                <div className="rounded-lg border border-[#F5C2C0] bg-[#FFF4F2] p-4">
                  <h3 className="text-[13px] font-bold text-[#B42318]">
                    Rejection Reason
                  </h3>

                  <p className="mt-2 text-[12px] font-semibold text-[#34415B]">
                    {viewingOnboardingRequest.rejectionReason}
                  </p>

                  {viewingOnboardingRequest.rejectionDetails && (
                    <p className="mt-2 whitespace-pre-wrap break-words text-[12px] text-[#34415B]">
                      {viewingOnboardingRequest.rejectionDetails}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="flex justify-end border-t border-[#E9EDF1] px-6 py-4">
              <button
                type="button"
                onClick={() => setViewingOnboardingRequest(null)}
                className="rounded-lg bg-[#003B70] px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#00539B]"
              >
                Close
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

type RequestCenterHistoryRecord = {
  requestNumber: string
  requestType: string
  status: string
  environment: string
  submittedOn: string
  orderNumber: string
}

const REQUEST_CENTER_HISTORY_KEY = "atlas360-request-center-history"
const DEMO_REQUEST_CENTER_HISTORY: RequestCenterHistoryRecord[] = [
  {
    requestNumber: "REQ-DEMO-001",
    requestType: "Cancel Order",
    status: "Completed",
    environment: "QA2",
    submittedOn: "2026-10-20T10:30:00",
    orderNumber: "1002456789",
  },
  {
    requestNumber: "REQ-DEMO-002",
    requestType: "Update Order",
    status: "In Progress",
    environment: "QA2",
    submittedOn: "2026-10-19T14:15:00",
    orderNumber: "1002456790",
  },
]

function getRequestCenterHistory(): RequestCenterHistoryRecord[] {
  try {
    const saved = localStorage.getItem(REQUEST_CENTER_HISTORY_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function saveRequestCenterHistory(record: RequestCenterHistoryRecord) {
  const history = getRequestCenterHistory()
  localStorage.setItem(
    REQUEST_CENTER_HISTORY_KEY,
    JSON.stringify([record, ...history]),
  )

  window.dispatchEvent(new Event("atlas360-request-history-updated"))
}

/// Paste this component at the top level of App.tsx (outside App and other components).
// Uses React useState already imported in App.tsx.
function ServiceListPage({ onBack }: { onBack: () => void }) {
  type Environment = "QA2" | "Prod"
  type Service = {
    name: string
    cluster: string
    imageVersion: string
    startedAt: string
  }
  type Namespace = {
    id: string
    name: string
    dashboardUrl?: string
    services: Service[]
  }

  // 50 illustrative services, grouped across five namespaces.
  const groups = [
    {
      id: "ospk",
      name: "OSPK",
      names: [
        "Auth Service",
        "Cart API",
        "Checkout API",
        "Order API",
        "Slot Promise API",
        "AccuPick",
        "TPL Webhooks",
        "Inventory Service",
        "Pricing API",
        "Catalog Service",
        "Fulfillment API",
        "Batching Service",
        "Store Service",
        "Notification Service",
        "Gateway API",
      ],
    },
    {
      id: "retail",
      name: "RETAIL",
      names: [
        "Store Lookup API",
        "Item Service",
        "Store Configuration",
        "Retail Catalog",
        "Banner Service",
        "Location API",
        "Store Hours",
        "Product Availability",
        "Retail Events",
        "Retail Search",
      ],
    },
    {
      id: "payments",
      name: "PAYMENTS",
      names: [
        "Payment Gateway",
        "Card Authorization",
        "Refund Service",
        "Wallet Service",
        "Payment Ledger",
        "Fraud Detection",
        "Settlement API",
        "Billing Service",
        "Tax Calculator",
        "Receipt Service",
      ],
    },
    {
      id: "supply",
      name: "SUPPLY CHAIN",
      names: [
        "Warehouse API",
        "Shipment Tracker",
        "Carrier Service",
        "Receiving API",
        "Purchase Orders",
        "Vendor Portal",
        "Stock Transfer",
        "Demand Forecast",
      ],
    },
    {
      id: "identity",
      name: "IDENTITY",
      names: [
        "SSO Gateway",
        "User Directory",
        "Role Management",
        "Access Policy",
        "Audit Events",
        "Session Service",
        "Token Service",
      ],
    },
  ]
  const [environment, setEnvironment] = useState<Environment>("QA2")
  const [search, setSearch] = useState("")
  const [expanded, setExpanded] = useState<string | null>("ospk")
  const data: Namespace[] = groups.map((group, groupIndex) => ({
    id: group.id,
    name: group.name,
    // Add dashboardUrl here when the real Grafana URL is available.
    dashboardUrl: undefined,
    services: group.names.map((name, index) => ({
      name,
      cluster: `${environment.toLowerCase()}-${
        index % 2 === 0 ? "east" : "west"
      }-0${(groupIndex % 2) + 1}`,
      imageVersion: `${name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")}:${
        index % 2 === 0
          ? `master-aks-native-${337 + index}`
          : `26.10.02-${112 + index}`
      }`,
      startedAt: new Date(
        2026,
        9,
        18 - (index % 12),
        8 + (index % 9),
        (index * 7) % 60,
      ).toISOString(),
    })),
  }))
  const query = search.trim().toLowerCase()
  const filtered = data
    .map((namespace) => ({
      ...namespace,
      services:
        !query || namespace.name.toLowerCase().includes(query)
          ? namespace.services
          : namespace.services.filter((service) =>
              [service.name, service.cluster, service.imageVersion].some(
                (value) => value.toLowerCase().includes(query),
              ),
            ),
    }))
    .filter((namespace) => namespace.services.length > 0)
  const openId =
    query && !filtered.some((namespace) => namespace.id === expanded)
      ? (filtered[0]?.id ?? null)
      : expanded
  const count = filtered.reduce(
    (sum, namespace) => sum + namespace.services.length,
    0,
  )
  const formatStarted = (value: string) => {
    const date = new Date(value)
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
    }
  }

  return (
    <div className="space-y-5 pb-8">
      <div>
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to ATLAS360"
          title="Back to ATLAS360"
          className="
    mb-3 inline-flex
    h-9 w-11
    items-center justify-center
    rounded-lg
    bg-[#003B70] text-white
    shadow-sm
    transition-all duration-200
    hover:bg-[#00539B]
    hover:shadow-md
    active:scale-95
    focus-visible:outline
    focus-visible:outline-2
    focus-visible:outline-offset-2
    focus-visible:outline-[#00539B]
  "
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-[28px] font-bold text-[#13203D] sm:text-[34px]">
          Service List
        </h1>
        <p className="mt-2 text-[12px] text-[#69748B]">
          Complete service inventory by project namespace and environment.
        </p>
      </div>
      <section className="overflow-hidden rounded-xl border border-[#DDE3E9] bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-[#E9EDF1] p-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full sm:w-[220px]">
            <label
              htmlFor="service-list-environment"
              className="mb-1.5 block text-[12px] font-semibold text-[#34445C]"
            >
              Environment
            </label>
            <select
              id="service-list-environment"
              value={environment}
              onChange={(event) => {
                setEnvironment(event.target.value as Environment)
                setExpanded("ospk")
              }}
              className="h-10 w-full rounded-lg border border-[#CBD5E1] bg-white px-3 text-[13px] font-medium text-[#17233D] outline-none focus-visible:ring-2 focus-visible:ring-[#00539B]"
            >
              <option value="QA2">QA2</option>
              <option value="Prod">Prod</option>
            </select>
          </div>
          <div className="relative w-full sm:w-[280px]">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 size-[17px] -translate-y-1/2 text-[#667085]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by App Name, or Cluster"
              aria-label="Search services"
              className="h-10 w-full rounded-lg border border-[#B8C5D3] bg-white pl-10 pr-3 text-[12px] text-[#17233D] outline-none hover:border-[#8FA8BF] focus:border-[#003B70] focus:ring-2 focus:ring-[#003B70]/15"
            />
          </div>
        </div>
        <p className="px-5 py-3 text-[12px] text-[#526174]">
          Showing <strong className="text-[#17233D]">{count}</strong> services
          across <strong className="text-[#17233D]">{filtered.length}</strong>{" "}
          namespaces in {environment}
        </p>
        <div className="space-y-3 px-5 pb-5">
          {filtered.map((namespace) => {
            const isOpen = openId === namespace.id
            const panelId = `service-list-${namespace.id}`
            return (
              <section
                key={namespace.id}
                className="overflow-hidden rounded-lg border border-[#DDE3E9]"
              >
                <div
                  className={`flex items-center gap-3 px-4 py-3 ${
                    isOpen ? "bg-[#F1F6FB]" : "bg-white"
                  }`}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() =>
                      setExpanded((current) =>
                        current === namespace.id ? null : namespace.id,
                      )
                    }
                    className="flex min-w-0 flex-1 items-center gap-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00539B]"
                  >
                    <svg
                      className={`size-4 shrink-0 text-[#526174] transition-transform ${
                        isOpen ? "rotate-90" : ""
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                    <span className="min-w-0">
                      <span className="block text-[14px] font-bold text-[#17233D]">
                        {namespace.name}
                      </span>
                      <span className="block text-[11px] text-[#526174]">
                        {namespace.services.length} services · {environment}
                      </span>
                    </span>
                  </button>
                  {namespace.dashboardUrl ? (
                    <a
                      href={namespace.dashboardUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-[12px] font-semibold text-[#00539B] hover:underline"
                    >
                      Go to Grafana Dashboard ↗
                    </a>
                  ) : (
                    <span
                      className="shrink-0 text-[12px] font-semibold text-[#00539B]"
                      title="Grafana dashboard URL not configured yet"
                    >
                      Go to Grafana Dashboard ↗
                    </span>
                  )}
                </div>
                {isOpen && (
                  <div
                    id={panelId}
                    className="overflow-x-auto border-t border-[#DDE3E9]"
                  >
                    <table className="w-full min-w-[690px] text-left text-[12px]">
                      <thead className="bg-[#F8FAFC] text-[11px] text-[#526174]">
                        <tr className="bg-[#F4F8FC]  text-[11px] font-bold uppercase tracking-[0.13em] text-[#526174]">
                          <th scope="col" className="px-5 py-3 font-semibold">
                            Service / App Name
                          </th>
                          <th scope="col" className="px-4 py-3 font-semibold">
                            Cluster
                          </th>
                          <th scope="col" className="px-4 py-3 font-semibold">
                            Container Image Version
                          </th>
                          <th scope="col" className="px-4 py-3 font-semibold">
                            Container Start Time
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E9EDF1]">
                        {namespace.services.map((service) => {
                          const started = formatStarted(service.startedAt)
                          return (
                            <tr
                              key={`${namespace.id}-${service.name}`}
                              className="hover:bg-[#F8FAFC]"
                            >
                              <td className="px-5 py-3 font-semibold text-[#17233D]">
                                {service.name}
                              </td>
                              <td className="px-4 py-3 text-[#526174]">
                                {service.cluster}
                              </td>
                              <td className="px-4 py-3">
                                <span className="rounded-md bg-[#E8F0F7] px-2.5 py-1 font-medium text-[#003B70]">
                                  {service.imageVersion}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <HistoryDateTime value={service.startedAt} />
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )
          })}
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-[13px] font-semibold text-[#17233D]">
                No matching services
              </p>
              <p className="mt-1 text-[12px] text-[#526174]">
                Try another search or environment.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

type AutomationHistoryRecord = {
  id: string
  projectId: string
  project: string
  type: "Primary Project" | "POD"
  suite: string
  status: "Running" | "Passed" | "Failed"
  submittedOn: string
  results?: PriorityReportData
  reportUrl: string
}

const AUTOMATION_HISTORY_KEY = "atlas360-automation-test-history"
const DEMO_AUTOMATION_HISTORY: AutomationHistoryRecord[] = [
  {
    id: "AUTO-DEMO-001",
    projectId: "fulfillment",
    project: "Fulfillment",
    type: "Primary Project",
    suite: "P1 Test Cases, P2 Test Cases",
    status: "Passed",
    submittedOn: "2026-10-20T11:45:00",
    reportUrl: "#",
  },
  {
    id: "AUTO-DEMO-002",
    projectId: "order-management",
    project: "Order Management",
    type: "POD",
    suite: "P0 Test Cases",
    status: "Failed",
    submittedOn: "2026-10-19T09:20:00",
    reportUrl: "#",
  },
]

function getAutomationHistory(): AutomationHistoryRecord[] {
  try {
    const saved = window.localStorage.getItem(AUTOMATION_HISTORY_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function saveAutomationHistory(record: AutomationHistoryRecord) {
  const history = getAutomationHistory()

  window.localStorage.setItem(
    AUTOMATION_HISTORY_KEY,
    JSON.stringify([record, ...history]),
  )

  window.dispatchEvent(new Event("atlas360-automation-history-updated"))
}

function updateAutomationHistoryStatus(
  id: string,
  status: AutomationHistoryRecord["status"],
  results: PriorityReportData,
) {
  const history = getAutomationHistory()

  window.localStorage.setItem(
    AUTOMATION_HISTORY_KEY,
    JSON.stringify(
      history.map((record) =>
        record.id === id ? { ...record, status, results } : record,
      ),
    ),
  )

  window.dispatchEvent(new Event("atlas360-automation-history-updated"))
}

type SettingsData = {
  emailNotifications: boolean
  automationTests: boolean
  onboarding: boolean
  placeholder: boolean
  sendFor: "all" | "failures"
  alwaysCopy: string
  emailReport: boolean
  allowedDomains: string
}

const STORAGE_KEY = "atlas360-workspace-settings"

const defaults: SettingsData = {
  emailNotifications: true,
  automationTests: true,
  onboarding: true,
  placeholder: false,
  sendFor: "all",
  alwaysCopy: "",
  emailReport: true,
  allowedDomains: "albertsons.com, safeway.com",
}

function SettingsPage({ onBack }: { onBack: () => void }) {
  const [settings, setSettings] = useState<SettingsData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? { ...defaults, ...JSON.parse(saved) } : defaults
    } catch {
      return defaults
    }
  })

  const [saved, setSaved] = useState(false)

  const update = <K extends keyof SettingsData,>(
    key: K,
    value: SettingsData[K],
  ) => {
    setSettings((current) => ({ ...current, [key]: value }))
    setSaved(false)
  }

  const saveSettings = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
      setSaved(true)
    } catch {
      setSaved(false)
    }
  }

  const rowClass =
    "grid grid-cols-1 gap-3 border-b border-[#E8EDF2] px-5 py-5 last:border-b-0 md:grid-cols-[28%_minmax(0,1fr)] md:gap-8 md:px-7"

  const labelClass = "text-[13px] font-bold text-[#17233D]"
  const descriptionClass = "mt-1 text-[12px] leading-5 text-[#687386]"
  const inputClass =
    "w-full rounded-lg border border-[#DDE3E9] bg-white px-3 py-2.5 text-[13px] text-[#17233D] outline-none focus:border-[#00539B] focus:ring-2 focus:ring-[#00539B]/15"

  const checkbox = (
    key: "automationTests" | "onboarding" | "placeholder",
    label: string,
  ) => (
    <label className="flex cursor-pointer items-center gap-3 text-[13px] text-[#34445C]">
      <input
        type="checkbox"
        checked={settings[key]}
        disabled={!settings.emailNotifications}
        onChange={(event) => update(key, event.target.checked)}
        className="size-4 accent-[#003B70]"
      />
      {label}
    </label>
  )

  return (
    <div className="pb-10">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back to ATLAS360"
        title="Back to ATLAS360"
        className="
    mb-3 inline-flex
    h-9 w-11
    items-center justify-center
    rounded-lg
    bg-[#003B70] text-white
    shadow-sm
    transition-all duration-200
    hover:bg-[#00539B]
    hover:shadow-md
    active:scale-95
    focus-visible:outline
    focus-visible:outline-2
    focus-visible:outline-offset-2
    focus-visible:outline-[#00539B]
  "
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </svg>
      </button>

      <div className="mb-7">
        <h1 className="text-[28px] font-bold tracking-tight text-[#13203D] sm:text-[34px]">
          Settings
        </h1>
        <p className="mt-1 text-[13px] text-[#687386]">
          Workspace-wide options for Atlas 360.
        </p>
      </div>

      <section className="overflow-hidden rounded-xl border border-[#DDE3E9] bg-white shadow-sm">
        <div className={rowClass}>
          <div>
            <h2 className={labelClass}>Email notifications</h2>
            <p className={descriptionClass}>
              When a run finishes, Atlas emails the person who started it.
            </p>
          </div>
          <div>
            <label className="inline-flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                role="switch"
                checked={settings.emailNotifications}
                onChange={(event) =>
                  update("emailNotifications", event.target.checked)
                }
                className="sr-only peer"
              />
              <span className="relative h-6 w-11 rounded-full bg-[#9CA3AF] transition-colors peer-checked:bg-[#003B70] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#00539B] after:absolute after:left-[3px] after:top-[3px] after:size-[18px] after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5" />
              <span className="text-[12px] font-semibold text-[#34445C]">
                {settings.emailNotifications ? "On" : "Off"}
              </span>
            </label>
          </div>
        </div>

        <div className={rowClass}>
          <div>
            <h2 className={labelClass}>Email when these finish</h2>
            <p className={descriptionClass}>
              To the person who started the run.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {checkbox("automationTests", "Automation Tests")}
            {checkbox("requestcenterrequest", "Request Center Request")}
            {checkbox("onboardingrequest", "Onboarding Request")}
          </div>
        </div>

        <div className={rowClass}>
          <div>
            <h2 className={labelClass}>Send for</h2>
          </div>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 text-[13px] text-[#34445C]">
              <input
                type="radio"
                name="sendFor"
                checked={settings.sendFor === "all"}
                disabled={!settings.emailNotifications}
                onChange={() => update("sendFor", "all")}
                className="size-4 accent-[#003B70]"
              />
              Every finished run
            </label>
            <label className="flex items-center gap-3 text-[13px] text-[#34445C]">
              <input
                type="radio"
                name="sendFor"
                checked={settings.sendFor === "failures"}
                disabled={!settings.emailNotifications}
                onChange={() => update("sendFor", "failures")}
                className="size-4 accent-[#003B70]"
              />
              Only failed, errored or cancelled runs
            </label>
          </div>
        </div>

        <div className={rowClass}>
          <div>
            <h2 className={labelClass}>Allowed domains</h2>
            <p className={descriptionClass}>
              Every recipient must use one of these domains.
            </p>
          </div>
          <input
            type="text"
            value={settings.allowedDomains}
            onChange={(event) => update("allowedDomains", event.target.value)}
            placeholder="albertsons.com, safeway.com"
            className={inputClass}
          />
        </div>

        <div className={rowClass}>
          <div>
            <h2 className={labelClass}>Mail server</h2>
            <p className={descriptionClass}>
              Set in the API's .env (SMTP_HOST, SMTP_PORT, SMTP_SECURE,
              SMTP_FROM).
            </p>
          </div>
          <div>
            <input
              type="text"
              value="Configured by backend"
              readOnly
              aria-label="Mail server configuration"
              className={`${inputClass} bg-[#F4F6F8] text-[#687386]`}
            />
            <p className="mt-2 text-[11px] text-[#687386]">
              SMTP configuration will be read from the backend when connected.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 px-5 py-5 md:px-7">
          <button
            type="button"
            onClick={saveSettings}
            className="rounded-lg bg-[#003B70] px-6 py-2.5 text-[13px] font-semibold text-white hover:bg-[#00539B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00539B]"
          >
            Save
          </button>

          <button
            type="button"
            disabled
            title="Available when the email backend is connected"
            className="rounded-lg border border-[#DDE3E9] bg-[#F4F6F8] px-5 py-2.5 text-[13px] font-semibold text-[#8791A0] disabled:cursor-not-allowed"
          >
            Send me a test email
          </button>

          {saved && (
            <span
              role="status"
              className="text-[12px] font-medium text-[#16765B]"
            >
              Settings saved locally.
            </span>
          )}
        </div>
      </section>
    </div>
  )
}

type AccessUser = {
  email: string
  name: string
  lastSignIn?: string
}

type AccessStore = {
  admins: AccessUser[]
  projectUsers: Record<string, AccessUser[]>
}

const ACCESS_STORAGE_KEY = "atlas360-user-access"

const initialAccess: AccessStore = {
  admins: [
    {
      name: "Shruthi Gopalakrishna",
      email: "shruthi.g2@albertsons.com",
      lastSignIn: "Oct 21, 2026",
    },
    {
      name: "Subhankar",
      email: "subhankar@albertsons.com",
      lastSignIn: "Oct 22, 2026",
    },
  ],
  projectUsers: {},
}

function UserAccessPage({
  onBack,
  projectOptions,
}: {
  onBack: () => void
  projectOptions: { id: string name: string }[]
}) {
  const [access, setAccess] = useState<AccessStore>(() => {
    try {
      const saved = localStorage.getItem(ACCESS_STORAGE_KEY)
      return saved ? JSON.parse(saved) : initialAccess
    } catch {
      return initialAccess
    }
  })

  const [selectedProject, setSelectedProject] = useState(
    projectOptions[0]?.id ?? "",
  )
  const [adminEmail, setAdminEmail] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [message, setMessage] = useState("")

  const save = (next: AccessStore) => {
    setAccess(next)
    localStorage.setItem(ACCESS_STORAGE_KEY, JSON.stringify(next))
  }

  const normalize = (value: string) => value.trim().toLowerCase()
  const validEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const makeUser = (email: string): AccessUser => ({
    email,
    name: email
      .split("@")[0]
      .split(/[._-]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" "),
  })

  const addAdmin = () => {
    const email = normalize(adminEmail)
    if (!validEmail(email)) {
      setMessage("Enter a valid administrator email address.")
      return
    }
    if (access.admins.some((u) => u.email === email)) {
      setMessage("This administrator already exists.")
      return
    }
    save({
      ...access,
      admins: [...access.admins, makeUser(email)],
    })
    setAdminEmail("")
    setMessage("Administrator added.")
  }

  const removeAdmin = (email: string) => {
    if (access.admins.length <= 1) {
      setMessage("At least one administrator must remain.")
      return
    }
    save({
      ...access,
      admins: access.admins.filter((u) => u.email !== email),
    })
    setMessage("Administrator removed.")
  }

  const currentUsers = access.projectUsers[selectedProject] ?? []

  const addProjectUser = () => {
    const email = normalize(userEmail)
    if (!selectedProject || !validEmail(email)) {
      setMessage("Select a project and enter a valid email address.")
      return
    }
    if (currentUsers.some((u) => u.email === email)) {
      setMessage("This user already has access to this project.")
      return
    }
    save({
      ...access,
      projectUsers: {
        ...access.projectUsers,
        [selectedProject]: [...currentUsers, makeUser(email)],
      },
    })
    setUserEmail("")
    setMessage("Project user added.")
  }

  const removeProjectUser = (email: string) => {
    save({
      ...access,
      projectUsers: {
        ...access.projectUsers,
        [selectedProject]: currentUsers.filter((u) => u.email !== email),
      },
    })
    setMessage("Project access removed.")
  }

  const inputClass =
    "min-w-0 flex-1 rounded-lg border border-[#DDE3E9] bg-white px-3 py-2.5 text-[13px] text-[#17233D] outline-none focus:border-[#00539B] focus:ring-2 focus:ring-[#00539B]/15"

  const primaryButton =
    "rounded-lg bg-[#003B70] px-5 py-2.5 text-[12px] font-semibold text-white transition hover:bg-[#00539B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00539B] disabled:cursor-not-allowed disabled:opacity-50"

  return (
    <div className="pb-10">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back to ATLAS360"
        title="Back to ATLAS360"
        className="
    mb-3 inline-flex
    h-9 w-11
    items-center justify-center
    rounded-lg
    bg-[#003B70] text-white
    shadow-sm
    transition-all duration-200
    hover:bg-[#00539B]
    hover:shadow-md
    active:scale-95
    focus-visible:outline
    focus-visible:outline-2
    focus-visible:outline-offset-2
    focus-visible:outline-[#00539B]
  "
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </svg>
      </button>

      <div className="mb-7">
        <h1 className="text-[28px] font-bold tracking-tight text-[#17233D] sm:text-[34px]">
          Users & Access
        </h1>
        <p className="mt-1 text-[13px] text-[#687386]">
          Manage workspace administrators and project-level access.
        </p>
      </div>

      <div className="space-y-5">
        {/* Access levels */}
        <section className="rounded-xl border border-[#DDE3E9] bg-white p-5 shadow-sm md:p-6">
          <h2 className="mb-4 text-[15px] font-bold text-[#17233D]">
            Access levels
          </h2>
          <div className="space-y-3">
            {[
              {
                title: "Admin",
                description:
                  "Sees every project, onboards projects and PODs, and grants access.",
              },
              {
                title: "Project user",
                description:
                  "Sees and runs only the projects assigned to them below.",
              },
              {
                title: "No access",
                description:
                  "Projects not assigned to a user are invisible to them.",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#00539B]" />
                <p className="text-[13px] leading-5 text-[#526174]">
                  <strong className="text-[#17233D]">{item.title}</strong>
                  {" — "}
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Admins */}
        <section className="overflow-hidden rounded-xl border border-[#DDE3E9] bg-white shadow-sm">
          <div className="border-b border-[#E8EDF2] px-5 py-4 md:px-6">
            <h2 className="text-[15px] font-bold text-[#17233D]">Admins</h2>
            <p className="mt-1 text-[12px] text-[#687386]">
              Administrators can manage all workspace projects and access.
            </p>
          </div>

          <div className="divide-y divide-[#E8EDF2]">
            {access.admins.map((admin) => (
              <div
                key={admin.email}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 md:px-6"
              >
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-[#17233D]">
                    {admin.name}
                  </p>
                  <p className="break-all text-[12px] text-[#687386]">
                    {admin.email}
                  </p>
                </div>
                <div className="flex items-center gap-5">
                  <span className="text-[12px] text-[#687386]">
                    {admin.lastSignIn
                      ? `Last sign-in: ${admin.lastSignIn}`
                      : "Last sign-in: —"}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeAdmin(admin.email)}
                    className="text-[12px] font-semibold text-[#B42318] hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 border-t border-[#E8EDF2] bg-[#FAFCFE] px-5 py-4 sm:flex-row md:px-6">
            <input
              type="email"
              aria-label="New administrator email"
              placeholder="Enter administrator email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className={inputClass}
            />
            <button type="button" onClick={addAdmin} className={primaryButton}>
              Add admin
            </button>
          </div>
        </section>

        {/* Project users */}
        <section className="overflow-hidden rounded-xl border border-[#DDE3E9] bg-white shadow-sm">
          <div className="border-b border-[#E8EDF2] px-5 py-4 md:px-6">
            <h2 className="text-[15px] font-bold text-[#17233D]">
              Project users
            </h2>
            <p className="mt-1 text-[12px] text-[#687386]">
              Assign users to specific projects.
            </p>
          </div>

          <div className="px-5 py-5 md:px-6">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <label
                htmlFor="access-project"
                className="text-[13px] font-semibold text-[#34445C]"
              >
                Project
              </label>
              <select
                id="access-project"
                value={selectedProject}
                onChange={(e) => {
                  setSelectedProject(e.target.value)
                  setMessage("")
                }}
                className={`${inputClass} max-w-[320px]`}
              >
                {projectOptions.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="divide-y divide-[#E8EDF2]">
              {currentUsers.length === 0 ? (
                <p className="py-5 text-[12px] text-[#687386]">
                  No users yet — only admins can see this project.
                </p>
              ) : (
                currentUsers.map((user) => (
                  <div
                    key={user.email}
                    className="flex items-center justify-between gap-3 py-4"
                  >
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-[#17233D]">
                        {user.name}
                      </p>
                      <p className="break-all text-[12px] text-[#687386]">
                        {user.email}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProjectUser(user.email)}
                      className="text-[12px] font-semibold text-[#B42318] hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#E8EDF2] bg-[#FAFCFE] px-5 py-4 sm:flex-row md:px-6">
            <input
              type="email"
              aria-label="Project user email"
              placeholder="Email — access starts at their next sign-in"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className={inputClass}
            />
            <button
              type="button"
              onClick={addProjectUser}
              disabled={!selectedProject}
              className={primaryButton}
            >
              Add user
            </button>
          </div>
        </section>
      </div>

      {message && (
        <p
          role="status"
          className="mt-4 text-[12px] font-medium text-[#00539B]"
        >
          {message}
        </p>
      )}
    </div>
  )
}
