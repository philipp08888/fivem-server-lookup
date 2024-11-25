import { InformativeTooltip } from "@/src/components/InformativeTooltip";
import { ServerData } from "@/src/types/ServerData";
import { formatToHTMLColor } from "@/src/utils/formatToHTMLColor";
import { getFlagEmoji } from "@/src/utils/getFlagEmoji";
import { Metadata } from "next";
import Image from "next/image";

interface LookupPageProps {
  searchParams: Promise<{ query?: string }>;
}

export async function generateMetadata({
  searchParams,
}: LookupPageProps): Promise<Metadata> {
  const query = (await searchParams).query;
  return {
    title: `${query || "Error"} | FiveM Server Lookup`,
  };
}

/**
 *
 * @param query cfx server id of the server
 * @returns returns data object of server relevant details
 */
async function fetchDataFromAPI(query: string) {
  const request = await fetch(
    `https://servers-frontend.fivem.net/api/servers/single/${query}`
  );

  const { Data: data }: { Data: ServerData } = await request.json();
  return data;
}

const LookupPage = async ({ searchParams }: LookupPageProps) => {
  const lookupQuery = (await searchParams).query || "";

  const data = lookupQuery ? await fetchDataFromAPI(lookupQuery) : undefined;

  if (!data) {
    return <h1>Error while loading server</h1>;
  }

  return (
    <>
      <div className="flex flex-col gap-0 max-w-[1000px] w-full bg-[#333] mx-auto mt-8 rounded-md">
        {data.vars && data.vars.banner_detail && (
          <img
            src={data.vars.banner_detail}
            alt="Banner"
            className="rounded-t-md"
          />
        )}
        <div className="flex flex-col gap-4 px-8 py-4 rounded-b-md">
          <div className="flex flex-col gap-2">
            {data.vars.sv_projectName && (
              <>
                <p className="text-sm">
                  {formatToHTMLColor(data.vars.sv_projectName)}
                </p>
                <div className="h-[1px] w-full bg-[#999] rounded-lg" />
              </>
            )}
            <div className="flex justify-between gap-4">
              {data.iconVersion && (
                <Image
                  src={`https://servers-frontend.fivem.net/api/servers/icon/${lookupQuery}/${data.iconVersion}.png`}
                  className="rounded-md"
                  alt="Server Icon"
                  width={128}
                  height={128}
                />
              )}
              <p className="overflow-hidden text-xl">
                <span className="select-none">
                  {data.vars.locale && getFlagEmoji(data.vars.locale) + " "}
                </span>
                {formatToHTMLColor(data.hostname)}
              </p>
              <span className="text-nowrap">
                {data.clients} / {data.svMaxclients}
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs text-[#999] uppercase">Information</p>
            {data.upvotePower > 0 && (
              <div className="flex flex-row gap-1 items-center">
                <p>🚀 {data.upvotePower} Upvotes</p>
                <InformativeTooltip>
                  An upvote costs 5.95 euros (
                  <a
                    href="https://zap-hosting.com/en/shop/product/fivem-upvotes/"
                    rel="noopener noreferrer"
                  >
                    zap-hosting.com
                  </a>
                  ) <br />
                  {data.upvotePower} Upvotes x 5,95€ = {data.upvotePower * 5.6}{" "}
                  €
                </InformativeTooltip>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LookupPage;
