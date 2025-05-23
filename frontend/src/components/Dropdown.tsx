// src/components/Dropdown.tsx
"use client";

import { Transition } from "@headlessui/react";
import Link from "next/link";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
  useRef,
} from "react";

type DropdownContextType = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  toggleOpen: () => void;
};

const DropDownContext = createContext<DropdownContextType>({
  open: false,
  setOpen: () => {},
  toggleOpen: () => {},
});

const Dropdown = ({ children }: PropsWithChildren) => {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => {
    setOpen((previousState) => !previousState);
  };

  const contextValue = useMemo(
    () => ({ open, setOpen, toggleOpen }),
    [open, setOpen, toggleOpen]
  );

  return (
    <DropDownContext.Provider value={contextValue}>
      <div className="relative">{children}</div>
    </DropDownContext.Provider>
  );
};

const Trigger = ({ children }: PropsWithChildren) => {
  const { open, setOpen, toggleOpen } = useContext(DropDownContext);

  return (
    <>
      <button
        type="button"
        onClick={toggleOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleOpen();
          }
        }}
        tabIndex={0}
        className="bg-transparent border-none p-0 m-0 cursor-pointer"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {children}
      </button>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40"
          aria-label="Close dropdown"
          onClick={() => setOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setOpen(false);
            }
          }}
          tabIndex={0}
          style={{ background: "transparent", border: "none", padding: 0, margin: 0 }}
        ></button>
      )}
    </>
  );
};

type ContentProps = PropsWithChildren<{
  align?: "left" | "right";
  width?: "48";
  contentClasses?: string;
}>;

const Content = ({
  align = "right",
  width = "48",
  contentClasses = "py-1 bg-white",
  children,
}: ContentProps) => {
  const { open, setOpen } = useContext(DropDownContext);

  let alignmentClasses = "origin-top";
  if (align === "left") {
    alignmentClasses = "ltr:origin-top-left rtl:origin-top-right start-0";
  } else if (align === "right") {
    alignmentClasses = "ltr:origin-top-right rtl:origin-top-left end-0";
  }

  let widthClasses = "";
  if (width === "48") {
    widthClasses = "w-48";
  }

  return (
    <Transition
      show={open}
      enter="transition ease-out duration-200"
      enterFrom="opacity-0 scale-95"
      enterTo="opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
    >
      <button
        type="button"
        className={`absolute z-50 mt-2 rounded-md shadow-lg ${alignmentClasses} ${widthClasses}`}
        onClick={() => setOpen(false)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(false);
          }
        }}
        style={{ background: "transparent", border: "none", padding: 0, margin: 0 }}
      >
        <div className={`rounded-md ring-1 ring-black ring-opacity-5 ${contentClasses}`}>
          {children}
        </div>
      </button>
    </Transition>
  );
};

type DropdownLinkProps = {
  className?: string;
  href: string;
  children: React.ReactNode;
};

const DropdownLink = ({ className = "", children, href }: DropdownLinkProps) => {
  return (
    <Link
      href={href}
      className={
        "block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none " +
        className
      }
    >
      {children}
    </Link>
  );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;

function useMemo<T>(factory: () => T, deps: any[]): T {
  const ref = useRef<{ deps: any[]; value: T } | undefined>(undefined);

  if (!ref.current || !areHookInputsEqual(ref.current.deps, deps)) {
    ref.current = { deps, value: factory() };
  }

  return ref.current.value;
}

function areHookInputsEqual(nextDeps: any[], prevDeps: any[]) {
  if (prevDeps === null || nextDeps.length !== prevDeps.length) {
    return false;
  }
  for (let i = 0; i < prevDeps.length; i++) {
    if (Object.is(nextDeps[i], prevDeps[i]) === false) {
      return false;
    }
  }
  return true;
}

export default Dropdown;

