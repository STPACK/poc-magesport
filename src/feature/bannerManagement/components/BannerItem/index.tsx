import { useEffect, useState } from "react";
import {
  useFloating,
  useHover,
  useInteractions,
  safePolygon,
  autoUpdate,
} from "@floating-ui/react";
import Image from "next/image";
import {
  ArrowDownOutlined,
  DeleteFilled,
  ArrowUpOutlined,
} from "@ant-design/icons";
import { BannerItemProps } from "./interface";
import { cn } from "@/lib/util";

export function BannerItem({
  data,
  moveItem,
  isLoading,
  handleRemoveActiveItem,
  order,
  disabledUp,
  disabledDown,
}: BannerItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "right-start",
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, {
    handleClose: safePolygon({
      //   requireIntent: false,
    }),
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  function findScrollableParent(
    element: HTMLElement | null
  ): HTMLElement | null {
    if (element == null) {
      return null;
    }

    // Check if the element is scrollable
    if (
      (element.scrollHeight > element.clientHeight ||
        element.scrollWidth > element.clientWidth) &&
      [
        "overflow-auto",
        "overflow-scroll",
        "overflow-y-auto",
        "overflow-x-auto",
        "overflow-y-scroll",
        "overflow-x-auto",
      ].some((v) => element.classList.contains(v))
    ) {
      return element;
    }

    // If not, check its parent element
    return findScrollableParent(element.parentElement);
  }

  function handleScroll(e: Event) {
    const { scrollTop, scrollLeft } = e.target as HTMLDivElement;
    if (isOpen && (scrollTop > 0 || scrollLeft > 0)) {
      setIsOpen(false);
    }
  }
  useEffect(() => {
    const scrollableParent = findScrollableParent(
      refs.reference.current as HTMLElement
    );

    if (scrollableParent) {
      scrollableParent.addEventListener("scroll", handleScroll);

      return () => {
        scrollableParent.removeEventListener("scroll", handleScroll);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, refs.reference]);

  return (
    <>
      <div
        className="w-full px-[4px]"
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        <div
          className={cn("relative w-full border-2", {
            "border-blue-500 ": isOpen,
          })}
          style={{
            paddingTop: `${(3 / 6.5) * 100}%`,
          }}
        >
          <Image
            src={data.imageUrl}
            alt="with-links"
            className="absolute object-cover w-full h-full"
            fill
          />
        </div>
      </div>
      {isOpen && (
        <div
          className="flex w-[40px] flex-col gap-2 shadow-lg text-dark-gray p-1 rounded-md"
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          <button
            className="py-1 px-2 cursor-pointer hover:bg-gray-100 rounded disabled:text-gray-2 disabled:cursor-not-allowed"
            onClick={() => moveItem(order, "up")}
            disabled={disabledUp || isLoading}
          >
            <ArrowUpOutlined />
          </button>
          <button
            className="py-1 px-2 cursor-pointer hover:bg-gray-100 rounded disabled:text-gray-2 disabled:cursor-not-allowed"
            onClick={() => moveItem(order, "down")}
            disabled={disabledDown || isLoading}
          >
            <ArrowDownOutlined />
          </button>
          <button
            disabled={isLoading}
            className="py-1 px-2 cursor-pointer hover:bg-danger/10 text-danger rounded disabled:text-gray-2 disabled:cursor-not-allowed"
            onClick={() => handleRemoveActiveItem(data.id)}
          >
            <DeleteFilled />
          </button>
        </div>
      )}
    </>
  );
}
