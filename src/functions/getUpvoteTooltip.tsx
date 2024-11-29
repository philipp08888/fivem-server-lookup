import Link from "next/link";
import { formatEuro } from "./formatEuro";

export function getUpvoteTooltip(
  upvotes: number,
  upvotePrice: number
): React.JSX.Element {
  return (
    <>
      An upvote costs {upvotePrice}€ (
      <Link
        className="text-blue-500"
        href="https://zap-hosting.com/en/shop/product/fivem-upvotes/"
      >
        zap-hosting.com
      </Link>
      )
      <br />
      <br />
      {upvotes} Upvotes x {upvotePrice}€ ={" "}
      {formatEuro(Math.round(upvotes * upvotePrice))})
    </>
  );
}
