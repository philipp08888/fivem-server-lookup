import { Column } from "@/src/components/Column";
import { Divider } from "@/src/components/Divider";
import { Error } from "@/src/components/Error";
import { ImageWithFallback } from "@/src/components/ImageWithFallback";
import { Container } from "@/src/components/layout/Container";
import { PlayerSection } from "@/src/components/sections/PlayerSection";
import { ResourceSection } from "@/src/components/sections/ResourceSection";
import { Tag } from "@/src/components/Tag";
import fetchDataFromAPI from "@/src/functions/fetchDataFromAPI";
import { formatToHTMLColor } from "@/src/functions/formatToHTMLColor";
import { getFlagEmoji } from "@/src/functions/getFlagEmoji";
import { getUpvoteTooltip } from "@/src/functions/getUpvoteTooltip";
import { isDefined } from "@/src/functions/isDefined";
import { sanitizeColorCodes } from "@/src/functions/sanitizeColorCodes";
import upsertServer from "@/src/functions/upsertServer";
import { PlayIcon } from "@heroicons/react/24/outline";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface LookupPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: LookupPageProps): Promise<Metadata> {
  const id = (await params).id;

  if (!id) {
    return {
      title: `Error | FiveM Server Lookup`,
    };
  }

  const data = await fetchDataFromAPI(id);

  if (!data) {
    return {
      title: `Unknown | FiveM Server Lookup`,
    };
  }

  return {
    title: `${sanitizeColorCodes(data.hostname)} | FiveM Server Lookup`,
    description: "Get detailed information about this server",
  };
}

const Page = async ({ params }: LookupPageProps) => {
  const id = (await params).id;
  const data = await fetchDataFromAPI(id);

  if (!data) {
    notFound();
  }

  if (data.vars.lookup !== undefined && data.vars.lookup) {
    return <Error message="Lookups for this server are disabled." />;
  }

  await upsertServer(
    id,
    data.hostname,
    `https://servers-frontend.fivem.net/api/servers/icon/${id}/${data.iconVersion}.png`,
  );

  return (
    <>
      <Container>
        <div
          className="h-16 w-full rounded-t-md bg-black bg-cover bg-center"
          style={{
            backgroundColor: "#444",
            backgroundImage: `url(${data.vars.banner_detail ?? ""})`,
          }}
        />
        <div className="flex flex-col gap-4 rounded-b-md px-8 py-4">
          <div className="flex flex-col gap-2">
            {data.vars.sv_projectName && (
              <>
                <p className="text-sm">
                  {formatToHTMLColor(data.vars.sv_projectName)}
                </p>
                <Divider />
              </>
            )}
            <div className="flex flex-col justify-center gap-4 sm:flex-row sm:justify-between">
              {data.iconVersion && (
                <ImageWithFallback
                  src={`https://servers-frontend.fivem.net/api/servers/icon/${id}/${data.iconVersion}.png`}
                  className="rounded-md"
                  alt="Server Icon"
                  width={1920}
                  height={1080}
                  fallbackSrc="/no-icon.svg"
                  style={{
                    width: 128,
                    height: 128,
                  }}
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
          <div className="flex flex-row flex-wrap justify-between gap-2">
            <Column
              name="Upvotes"
              value={data.upvotePower}
              tooltipText={getUpvoteTooltip(data.upvotePower, 5.95)}
            />
            <Column name="Bursts" value={data.burstPower} />

            {isDefined(data.vars["txAdmin-version"]) && (
              <Column
                name="txAdmin Version"
                value={String(data.vars["txAdmin-version"])}
              />
            )}
            {isDefined(data.vars.sv_enforceGameBuild) && (
              <Column name="Game Build" value={data.vars.sv_enforceGameBuild} />
            )}
          </div>
          {isDefined(data.vars.tags) && data.vars.tags.length > 0 && (
            <div className="flex flex-col gap-1">
              <Tag>Tags</Tag>
              <div className="flex flex-row flex-wrap gap-2">
                {data.vars.tags.split(",").map((tag, index) => (
                  <span
                    key={tag + index}
                    className="rounded-md bg-[#888] px-2 py-1 text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          {data.connectEndPoints[0] !==
            "https://private-placeholder.cfx.re/" && (
            <div className="flex flex-col gap-1">
              <Tag>Endpoints</Tag>
              <div className="flex flex-row gap-2">
                <ul className="flex flex-col flex-wrap gap-1">
                  {data.connectEndPoints.map((endPoint) => (
                    <li
                      key={endPoint}
                      className="flex flex-row items-center gap-2 rounded-md bg-[#444] px-2 py-1"
                    >
                      <p className="text-sm">{endPoint}</p>
                      <a href={`fivem://${endPoint}`} title="Connect to server">
                        <PlayIcon className="size-5 text-primary [&>path]:stroke-[2]" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </Container>
      {data.players && data.players.length > 0 && (
        <PlayerSection players={data.players} />
      )}
      {data.resources && data.resources.length > 0 && (
        <ResourceSection resources={data.resources} />
      )}
    </>
  );
};

export default Page;
