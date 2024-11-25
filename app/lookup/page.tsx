import { Error } from "@/src/components/Error";
import { InformativeTooltip } from "@/src/components/InformativeTooltip";
import { ServerData } from "@/src/types/ServerData";
import { formatToHTMLColor } from "@/src/utils/formatToHTMLColor";
import { getFlagEmoji } from "@/src/utils/getFlagEmoji";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

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
    return (
      <Error message="Error while loading server lookup! Please try again!" />
    );
  }

  return (
    <>
      <div className="flex flex-col gap-0 max-w-[1000px] w-full bg-[#333] mx-auto mt-4 rounded-md shadow-bg">
        {data.vars && data.vars.banner_detail && (
          <img
            src={data.vars.banner_detail}
            alt="Banner"
            className="rounded-t-md max-h-full aspect-auto"
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
            <div className="flex flex-col sm:flex-row justify-center sm:justify-between gap-4">
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
            <div className="flex flex-row justify-between flex-wrap">
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
                    {data.upvotePower} Upvotes x 5,95€ ={" "}
                    {Math.round(data.upvotePower * 5.6)} €
                  </InformativeTooltip>
                </div>
              )}
              {data.vars?.sv_enforceGameBuild && (
                <div className="flex flex-row gap-1 items-center">
                  <p>🎮 Game Build {data.vars.sv_enforceGameBuild}</p>
                  <InformativeTooltip>
                    The sv_enforceGameBuild setting sets the game version for
                    the server and thus makes it possible to access new DLC
                    content such as cars, weapons or interiors.
                    <br />
                    You can find a list of the game versions currently supported
                    by FiveM here:{" "}
                    <Link href="https://zap-hosting.com/guides/docs/fivem-gamebuild/#available-gamebuilds">
                      Game Builds
                    </Link>
                  </InformativeTooltip>
                </div>
              )}
              {data.server && (
                <div className="flex flex-row gap-1 items-center">
                  <p>{data.server}</p>
                  <InformativeTooltip>
                    The server data point usually tells you which operating
                    system the respective server is running on
                  </InformativeTooltip>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LookupPage;
