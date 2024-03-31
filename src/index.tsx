import { Action, ActionPanel, Icon, List } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { useMemo, useState } from "react";

import { buildUrl, type Check } from "./utils";

const applyFix = (text: string, { pos, len, s }: Pick<Check, "pos" | "len" | "s">) => {
  const left = text.slice(0, pos);
  const right = text.slice(pos + len);
  return `${left}${s[0]}${right}`;
};

export default function Command() {
  const [text, setText] = useState("");
  const { isLoading, data, mutate } = useFetch<Check[]>(buildUrl(text), { execute: !!text });

  const fixedText = useMemo(() => {
    if (!data) return text;
    return data.toReversed().reduce(applyFix, text);
  }, [data, text]);

  const fixOne = (check: Check, i: number) => {
    setText(applyFix(text, check));

    mutate(Promise.resolve(), {
      optimisticUpdate: (prevData) => {
        return prevData?.splice(i, 1);
      },
    });
  };

  const fixAll = () => {
    if (!data) return;

    setText(fixedText);

    mutate(Promise.resolve(), {
      optimisticUpdate: () => [],
    });
  };

  return (
    <List
      searchText={text}
      onSearchTextChange={setText}
      isLoading={isLoading}
      searchBarPlaceholder="Paste your text"
      throttle
    >
      {!data?.length ? (
        <List.EmptyView title={"All good!"} description={"No spelling mistakes found."} />
      ) : (
        <>
          {!isLoading && (
            <List.Item
              key={"fix-all"}
              title={""}
              subtitle={`${fixedText}`}
              icon={{ source: "🪄" }}
              actions={
                <ActionPanel>
                  <Action title="Fix All" onAction={() => fixAll()} />
                </ActionPanel>
              }
            />
          )}
          {data.map((check, i) => (
            <List.Item
              key={`fix-${check.word}`}
              title={check.word}
              subtitle={check.s.slice(0, 5).join(", ")}
              icon={Icon.XMarkCircle}
              actions={
                <ActionPanel>
                  <Action title="Fix Word" onAction={() => fixOne(check, i)} />
                </ActionPanel>
              }
            />
          ))}
        </>
      )}
    </List>
  );
}
