import { Children, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signoutadmin } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  TransitionChild,
} from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { BadgePercent, DockIcon, HandCoins, HeartHandshake, MessageSquareQuote, ScrollText, Trophy, UserX } from "lucide-react";

const Management = [
  { name: "Unblocked Users", to: "/admin/user/unblock", current: true },
  { name: "Blocked User", to: "/admin/user/block", current: false },
  { name: "Active Member", to: "/admin/user/active", current: false },
  { name: "Inactive Member", to: "/admin/user/inactive", current: false },
  { name: "All User", to: "/admin/user/all", current: false },
];
const sal = [
  { name: "Salary Anylysis", to: "/admin/salary-analysis", current: true },
  { name: "Today Salary", to: "/admin/salary-today", current: false },
  { name: "Transactions", to: "/admin/salary-transactions", current: false },

];
const Requests = [
  {
    name: "Withdrawal",
    to: "/admin/pending-withdrawal-request",
    current: true,
  },
  {
    name: "ROI Withdrawal",
    to: "/admin/roi-pending-withdrawal-request",
    current: false,
  },
  {
    name: "Principle Withdrawal",
    to: "/admin/pending-principle-withdrawal-request",
    current: false,
  },
  { name: "Deposite", to: "/admin/deposite", current: false },
  { name: "TopUp", to: "/admin/topup", current: false },
];

const MainMenu = [
  {
    name: "Dashboard",
    to: "/admin/dashboard",
    icon: HomeIcon,
    current: true,
    submenu: [],
  },
  {
    name: "Membership Plans",
    to: "/admin/membership/plan",
    icon: FolderIcon,
    current: false,
    submenu: [],
  },
  {
    name: "Rewards",
    to: "/admin/reward-plans",
    icon: Trophy,
    current: false,
    submenu: [],
  },
  {
    name: "Salaries",
    to: "/admin/salary-analysis",
    icon: HandCoins,
    current: false,
    submenu: sal,
  },
  {
    name: "Reports",
    to: "/admin/reports",
    icon: ScrollText,
    current: false,
    submenu: [],
  },
  {
    name: "Defaulter",
    to: "/admin/defaulter",
    icon: UserX,
    current: false,
    submenu: [],
  },
  {
    name: "Queries",
    to: "/admin/tickets",
    icon: MessageSquareQuote,
    current: false,
    submenu: [],
  },
  {
    name: "QR setting",
    to: "/admin/qr/Link",
    icon: DocumentDuplicateIcon,
    current: false,
    submenu: [],
  },
];

const User_Interface = [
  {
    id: 1,
    name: "Management",
    to: "/admin/user/all",
    initial: "M",
    current: false,
    submenu: Management,
  },
  {
    id: 2,
    name: "Rewards",
    to: "/admin/rewards",
    initial: "R",
    current: false,
    submenu: [],
  },
  // {
  //   id: 2,
  //   name: "CTO",
  //   to: "/admin/cto",
  //   initial: "R",
  //   current: false,
  //   submenu: [],
  // },
  {
    id: 2,
    name: "Achivers",
    to: "/admin/achivers",
    initial: "A",
    current: false,
    submenu: [],
  },
  {
    id: 3,
    name: "Transactions",
    to: "/admin/pending-withdrawal-request",
    initial: "T",
    current: false,
    submenu: Requests,
  },
  {
    id: 3,
    name: "Reward Transactions",
    to: "/admin/reward-transactions",
    initial: "T",
    current: false,
    submenu: Requests,
  },
  {
    id: 3,
    name: "Income",
    to: "/admin/income",
    initial: "I",
    current: false,
    submenu: [],
  },
];
const Settings = [
  {
    id: 2,
    name: "General",
    to: "/admin/settings",
    initial: "G",
    current: false,
    submenu: [],
  },
  {
    id: 3,
    name: "create notification",
    to: "/admin/notification",
    initial: "C",
    current: false,
    submenu: [],
  },
  {
    id: 4,
    name: "notification list",
    to: "/admin/notification/list",
    initial: "N",
    current: false,
    submenu: [],
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AdminMenu({ Children, PageName }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { admin } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [headerMenu, setHeaderMenu] = useState([]);
  const [currentTab, setCurrentTab] = useState([]);
  const [currentSubTab, setCurrentSubTab] = useState("Dashboard");

  function handleHeaderMenu(submenu, name) {
    console.log(submenu, name);
    setHeaderMenu(submenu);
    setCurrentTab(name);
  }
  function handlesignout() {
    dispatch(signoutadmin());
    navigate("/admin/login");
  }

  const menus = MainMenu ;

  return (
    <>
      <div>
        <div className="">
          <Dialog
            open={sidebarOpen}
            onClose={setSidebarOpen}
            className="relative z-50 lg:hidden"
          >
            <DialogBackdrop
              transition
              className="fixed inset-0 bg-gray-900/50  transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
            />

            <div className="fixed inset-0 flex">
              <DialogPanel
                transition
                className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
              >
                <TransitionChild>
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                    <button
                      type="button"
                      onClick={() => setSidebarOpen(false)}
                      className="-m-2.5 p-2.5"
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        aria-hidden="true"
                        className="w-6 h-6 text-white"
                      />
                    </button>
                  </div>
                </TransitionChild>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex no-scrollbar overflow-auto grow flex-col gap-y-5 overflow-y-auto bg-black px-6 pb-4 ring-1 ring-white/10 border-r border-gray-800">
                  <div className="flex items-center shrink-0 border-b   py-2 px-5">
                    <Link to="/">
                      {/* <img alt="Logo" src="/finrain.png" className="w-28" /> */}
                      <div className="flex items-center justify-center w-20">
                        <img
                          alt="logo"
                          src="/logo.png"
                          className="w-auto  "
                        />
                      </div>
                    </Link>
                  </div>
                  <nav className="flex flex-col flex-1">
                    <ul
                      role="list"
                      className="flex flex-col flex-1 px-6 gap-y-7"
                    >
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {menus.map((item) => (
                            <li key={item.name}>
                              <Link
                                to={
                                  item?.name == "Refferals"
                                    ? `/admin/refferaltable/${item?.refferal_code}`
                                    : item?.to
                                }
                                onClick={() =>
                                  handleHeaderMenu(item.submenu, item.name)
                                }
                                className={classNames(
                                  item?.name == currentTab
                                    ? "shadow-lg border-white/50 text-gray-100 border bg-gray-900/50 hover:bg-gray-900/50 hover:text-[#ffeded]"
                                    : "text-gray-100  ",
                                  "group flex items-center rounded-r-full px-2 py-2 text-sm font-medium leading-6 "
                                )}
                              >
                                <item.icon
                                  aria-hidden="true"
                                  className="w-6 h-6 mr-3 shrink-0"
                                />
                                {item?.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li>
                        <div className="text-xs font-semibold leading-6 text-gray-300">
                          User Interface
                        </div>
                        <ul role="list" className="mt-2 -mx-2 space-y-1">
                          {User_Interface.map((team) => (
                            <li key={team.name}>
                              <Link
                                onClick={() =>
                                  handleHeaderMenu(team.submenu, team.name)
                                }
                                to={team.to}
                                className={classNames(
                                  team.name == currentTab
                                    ? "shadow-lg border-white/50 text-gray-100 border bg-gray-900/50 hover:bg-gray-900/50 hover:text-[#ffeded]"
                                    : "text-gray-100  ",
                                  "group flex items-center rounded-r-full px-2 py-2 text-sm font-medium leading-6 "
                                )}
                              >
                                <span className="flex h-6 w-6 shrink-0 mr-3 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                                  {team.initial}
                                </span>
                                <span className="truncate">{team.name}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li>
                        <div className="text-xs font-semibold leading-6 text-gray-300">
                          Settings
                        </div>
                        <ul role="list" className="mt-2 -mx-2 space-y-1">
                          {Settings.map((team) => (
                            <li key={team.name}>
                              <Link
                                onClick={() =>
                                  handleHeaderMenu(team.submenu, team.name)
                                }
                                to={team.to}
                                className={classNames(
                                  team.name == currentTab
                                    ? "shadow-lg border-white/50 text-gray-100 border bg-gray-900/50 hover:bg-gray-900/50 hover:text-[#ffeded]"
                                    : "text-gray-100  ",
                                  "group flex items-center rounded-r-full px-2 py-2 text-sm font-medium leading-6 "
                                )}
                              >
                                <span className="flex h-6 w-6 mr-3 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                                  {team.initial}
                                </span>
                                <span className="truncate">{team.name}</span>
                              </Link>
                            </li>
                          ))}
                          <li>
                            <Link
                              to={`/admin/check/profile/${admin?.id}`}
                              className={classNames(
                                "text-gray-400 hover:bg-gray-800 hover:text-white",
                                "group flex gap-x-3 rounded-md p-2 text-lg font-semibold leading-6"
                              )}
                            >
                              <span className="flex h-6 w-6 shrink-0  items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                                P
                              </span>
                              <span className="truncate text-sm">Profile</span>
                            </Link>
                          </li>
                          <li>
                            <button
                              onClick={handlesignout}
                              className={classNames(
                                "text-gray-200 hover:bg-gray-800 hover:text-white",
                                "group flex gap-x-3 rounded-md p-2 text-lg font-semibold leading-6"
                              )}
                            >
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                                L
                              </span>
                              <span className="truncate text-white text-sm">
                                Logout
                              </span>
                            </button>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </DialogPanel>
            </div>
          </Dialog>

          <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col ">
            <div className="flex flex-col pb-10 overflow-auto overflow-y-auto no-scrollbar grow  bg-black">
              <div className="flex  items-center py-2 px-5 border-b shrink-0">
                <Link to="/">
                  {/* <img alt="Logo" src="/finrain.png" className="w-28" /> */}
                  <div className="flex items-center justify-center w-20">
                    <img
                      alt="Earn4u2 Logo"
                      src="/logo.png"
                      className="w-auto  "
                    />
                  </div>
                </Link>
              </div>
              <nav className="flex-shrink-0 h-full px-4 pt-3 overflow-y-auto divide-y divide-gray-300">
                <ul role="list" className="px-2 space-y-1">
                  <li>
                    <ul role="list" className="space-y-1 ">
                      {menus.map((item) => (
                        <li key={item?.name}>
                          <Link
                            to={
                              item?.name === "Refferals"
                                ? `/admin/refferaltable/${admin?.refferal_code}`
                                : item.to
                            }
                            onClick={() =>
                              handleHeaderMenu(item.submenu, item.name)
                            }
                            className={classNames(
                              item.name == currentTab
                                ? "shadow-lg border-white/50 text-gray-100 border bg-gray-900/50 hover:bg-gray-900/50 hover:text-[#ffeded]"
                                : "text-gray-100  ",
                              "group flex items-center rounded-r-full px-2 py-2 text-sm font-medium leading-6 "
                            )}
                          >
                            <item.icon
                              aria-hidden="true"
                              className="flex-shrink-0 w-6 h-6 mr-3"
                            />
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li>
                    <div className="text-xs font-semibold leading-6 text-gray-100">
                      User Interface
                    </div>
                    <ul role="list" className="mt-2 -mx-2 space-y-1">
                      {User_Interface.map((team) => (
                        <li key={team.name}>
                          <Link
                            onClick={() =>
                              handleHeaderMenu(team.submenu, team.name)
                            }
                            to={team.to}
                            className={classNames(
                              team.name == currentTab
                                ? "shadow-lg border-white/50 text-gray-100 border bg-gray-900/50 hover:bg-gray-900/50 hover:text-[#ffeded]"
                                : "text-gray-100  ",
                              "group flex items-center rounded-r-full px-2 py-2 text-sm font-medium leading-6 "
                            )}
                          >
                            <span className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                              {team.initial}
                            </span>
                            <span className="truncate">{team.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li>
                    <div className="text-xs font-semibold leading-6 text-gray-100">
                      Settings
                    </div>
                    <ul role="list" className="mt-2 -mx-2 space-y-1">
                      {Settings.map((team) => (
                        <li key={team.name}>
                          <Link
                            onClick={() =>
                              handleHeaderMenu(team.submenu, team.name)
                            }
                            to={team.to}
                            className={classNames(
                              team.name == currentTab
                                ? "shadow-lg border-white/50 text-gray-100 border bg-gray-900/50 hover:bg-gray-900/50 hover:text-[#ffeded]"
                                : "text-gray-100  ",
                              "group flex items-center rounded-r-full px-2 py-2 text-sm font-medium leading-6 "
                            )}
                          >
                            <span className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-800 text-[0.625rem] font-medium text-gray-200 group-hover:text-white">
                              {team.initial}
                            </span>
                            <span className="truncate">{team.name}</span>
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link
                          to={`/admin/check/profile/${admin?.id}`}
                          className={classNames(
                            "text-gray-100  ",
                            "group flex gap-x-3 rounded-md p-2 text-lg font-semibold leading-6"
                          )}
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-300 bg-gray-800 text-[0.625rem] font-medium text-gray-200 group-hover:text-white">
                            P
                          </span>
                          <span className="text-gray-200 text-sm truncate">
                            Profile
                          </span>
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={handlesignout}
                          className={classNames(
                            "text-gray-100  ",
                            "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                          )}
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-300 bg-gray-800 text-[0.625rem] font-medium text-gray-200 group-hover:text-white">
                            L
                          </span>
                          <span className="truncate text-white text-sm">
                            Logout
                          </span>
                        </button>
                      </li>
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>

        <div className="lg:pl-72 ">
          <div className="min-h-full">
            <div className="z-50 w-full lg:fixed">
              <Disclosure as="nav" className="text-gray-100 bg-[#844fc1] ">
                <div className="max-w-full ml-4 ">
                  <div className="flex items-center justify-end h-16">
                    <div className="hidden w-1/3 lg:block ">
                      <div className="flex items-center ml-4 ">
                        <button
                          type="button"
                          className="relative p-1 text-yellow-700 bg-yellow-300 rounded-full hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                          <span className="absolute" />
                          <span className="sr-only">View notifications</span>
                          <BellIcon aria-hidden="true" className="w-6 h-6 " />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-end w-full lg:hidden">
                      <div className="sticky top-0 z-40 flex items-center h-16 px-4 bg-green-800 shadow-sm shrink-0 gap-x-4 sm:gap-x-6 sm:px-6 lg:px-8">
                        <button
                          type="button"
                          onClick={() => setSidebarOpen(true)}
                          className="-m-2.5 p-2.5 text-gray-200 lg:hidden"
                        >
                          <span className="sr-only">Open sidebar</span>
                          <Bars3Icon aria-hidden="true" className="h-7 w-7" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Disclosure>

              <header className="text-gray-100  bg-[#5e3dc9]">
                <div className="px-4 py-0 border-t-2 border-b-2 border-green-300 max-w-7xl sm:px-6 lg:px-8">
                  <nav aria-label="Breadcrumb" className="flex text-base ">
                    <div className="flex items-center gap-2">
                      <svg
                        fill="currentColor"
                        viewBox="0 0 24 44"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                        className="flex-shrink-0 w-6 h-full text-green-200"
                      >
                        <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                      </svg>
                      Admin / {PageName}
                    </div>
                  </nav>
                </div>
              </header>
            </div>
            <main className="lg:pt-28 -z-10 bg-blue-900/50">
              <div className="flex items-center w-full ">
                <div className="pl-6 sm:block">
                  <div className="">
                    <nav aria-label="Tabs" className="flex w-full gap-x-5">
                      {headerMenu.map((tab) => (
                        <Link
                          key={tab.name}
                          to={tab.to}
                          onClick={() => setCurrentSubTab(tab.name)}
                          aria-current={tab.current ? "page" : undefined}
                          className={classNames(
                            tab.name == currentSubTab
                              ? "border-indigo-200 text-indigo-300"
                              : "border-transparent text-gray-300 hover:border-gray-300 hover:text-gray-700",
                            " border-b-2 px-1 py-4 text-center gap-3 lg:text-lg text-[10px]"
                          )}
                        >
                          {tab.name}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </div>
              </div>
              <div
                className="relative min-h-screen flex flex-col gap-5 overflow-y-auto"
                style={{
                  backgroundImage:
                    "url('https://img.freepik.com/free-photo/3d-rendering-financial-neon-bull_23-2151691899.jpg?ga=GA1.1.1673403856.1719407260&semt=ais_authors_boost')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="relative z-10">{Children}</div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
