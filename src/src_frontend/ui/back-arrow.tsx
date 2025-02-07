"use static";
import Link from "next/link";
import { memo } from "react";
import { MdArrowBack } from "react-icons/md";

const BackArrow = memo(() => {
  return (
    <Link href="/" className="absolute left-4 top-4 border">
      <MdArrowBack size={30} />
    </Link>
  );
});
BackArrow.displayName = "BackArrow";
export default BackArrow;
