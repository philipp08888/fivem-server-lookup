import Link from "next/link";
import { formatEuro } from "./formatEuro";

export function getUpvoteTooltip(
  upvotes: number,
  upvotePrice: number,
): React.JSX.Element {
  return (
    <>
      Each upvote costs {formatEuro(upvotePrice)} (
      <Link
        className="text-blue-500"
        href="https://zap-hosting.com/en/shop/product/fivem-upvotes/"
      >
        Zap Hosting
      </Link>
      ) as of September 2025. <br /> <br />
      {upvotes} upvotes × {formatEuro(upvotePrice)} ={" "}
      {formatEuro(Math.round(upvotes * upvotePrice))}
    </>
  );
}
