import { colorMap } from "./colorMap";

export function formatToHTMLColor(text: string): React.JSX.Element[] {
  const parts: JSX.Element[] = [];
  const regex = /\^(\d)([^^]*)/g;
  let match;
  let lastIndex = 0;

  while ((match = regex.exec(text)) !== null) {
    const colorIndex = parseInt(match[1], 10);
    const colorClass = colorMap[colorIndex] || colorMap[0];
    const content = match[2];

    if (match.index > lastIndex) {
      parts.push(
        <span key={lastIndex} className={colorMap[0]}>
          {text.slice(lastIndex, match.index)}
        </span>,
      );
    }

    parts.push(
      <span key={match.index} className={colorClass}>
        {content}
      </span>,
    );

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(
      <span key={lastIndex} className={colorMap[0]}>
        {text.slice(lastIndex)}
      </span>,
    );
  }

  return parts;
}
