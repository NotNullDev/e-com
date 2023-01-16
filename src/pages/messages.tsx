import type { Conversation } from "@prisma/client";
import * as Dialog from "@radix-ui/react-dialog";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import create from "zustand";
import { immer } from "zustand/middleware/immer";
import SearchWithNavigation from "../components/SearchWithNavigation";
import { trpc } from "../utils/trpc";

type MessagesPageStore = {
  conversations: Conversation[];
  selectedConversationId?: number;
};

const messagesStore = create<MessagesPageStore>()(
  immer((set, get, store) => {
    return {
      conversations: [],
      selectedConversationId: undefined,
    };
  })
);

const MessagesPage = () => {
  const { data } = trpc.products.getConversations.useQuery(undefined, {
    placeholderData: [],
    onSuccess: (data) => {
      if (!data) {
        toast("??????");
      } else {
        toast(`data length: ${data.length}`);
        console.log(data);
      }
    },
  });

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="container flex w-[1200px] justify-end py-4">
        <NewConversationModal />
      </div>
      <div className="flex h-[500px] w-[1200px] border-t border-indigo-800 shadow-md shadow-indigo-700">
        <div className="flex-1 overflow-y-auto border-r border-indigo-900">
          {/* conversation title start */}
          {data?.map((c) => {
            return (
              <>
                <ConversationPreview conversation={c} key={c.id.toString()} />
              </>
            );
          })}
          {data?.length === 0 && <div>No conversations found</div>}
          {/* conversation title end */}
        </div>
        <div className="flex flex-[2] flex-col">
          <div className="flex flex-1 flex-col-reverse overflow-y-auto p-4">
            <div className="chat chat-start">
              <div className="chat-image avatar"></div>
              <div className="chat-header">
                Obi-Wan Kenobi
                <time className="text-xs opacity-50">2 hours ago</time>
              </div>
              <div className="chat-bubble">You were the Chosen One!</div>
              <div className="chat-footer opacity-50">Seen</div>
            </div>
            <div className="chat chat-start">
              <div className="chat-image avatar"></div>
              <div className="chat-header">
                Obi-Wan Kenobi
                <time className="text-xs opacity-50">2 hours ago</time>
              </div>
              <div className="chat-bubble">You were the Chosen One!</div>
              <div className="chat-footer opacity-50">Seen</div>
            </div>
            <div className="chat chat-end">
              <div className="chat-image avatar"></div>
              <div className="chat-header">
                Obi-Wan Kenobi
                <time className="text-xs opacity-50">2 hours ago</time>
              </div>
              <div className="chat-bubble">You were the Chosen One!</div>
              <div className="chat-footer opacity-50">Seen</div>
            </div>
            <div className="chat chat-end">
              <div className="chat-image avatar"></div>
              <div className="chat-header">
                Obi-Wan Kenobi
                <time className="text-xs opacity-50">2 hours ago</time>
              </div>
              <div className="chat-bubble">You were the Chosen One!</div>
              <div className="chat-footer opacity-50">Seen</div>
            </div>
            <div className="chat chat-end">
              <div className="chat-image avatar"></div>
              <div className="chat-header">
                Obi-Wan Kenobi
                <time className="text-xs opacity-50">2 hours ago</time>
              </div>
              <div className="chat-bubble">You were the Chosen One!</div>
              <div className="chat-footer opacity-50">Seen</div>
            </div>
            <div className="chat chat-end">
              <div className="chat-image avatar"></div>
              <div className="chat-header">
                Obi-Wan Kenobi
                <time className="text-xs opacity-50">2 hours ago</time>
              </div>
              <div className="chat-bubble">You were the Chosen One!</div>
              <div className="chat-footer opacity-50">Seen</div>
            </div>
            <div className="chat chat-end">
              <div className="chat-image avatar"></div>
              <div className="chat-header">
                Obi-Wan Kenobi
                <time className="text-xs opacity-50">2 hours ago</time>
              </div>
              <div className="chat-bubble">You were the Chosen One!</div>
              <div className="chat-footer opacity-50">Seen</div>
            </div>
          </div>
          <input className="input-bordered input"></input>
        </div>
      </div>
    </div>
  );
};

const NewConversationModal = () => {
  const peopleListRef = useRef<HTMLUListElement>(null);
  const [dropdownKey, setDropdownKey] = useState(0);
  const [userFilter, setUserFilter] = useState("");
  const { data, status } = trpc.users.search.useQuery({
    where: {
      OR: [
        {
          name: {
            contains: userFilter,
            mode: "insensitive",
          },
        },
        {
          id: {
            contains: userFilter,
            mode: "insensitive",
          },
        },
      ],
    },
  });

  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button className="btn-primary btn">Start new</button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="absolute inset-0 h-screen w-screen bg-black/30" />
          <Dialog.Content className="absolute top-1/2 left-1/2 flex h-[50vh] w-[50vw] -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl bg-base-200">
            <Dialog.Title className="fond-bold p-4 text-xl shadow">
              <h1>New conversation</h1>
              <Dialog.Close>
                <button className="btn-ghost btn-sm btn absolute right-0 top-0 m-2">
                  X
                </button>
              </Dialog.Close>
            </Dialog.Title>

            <div className="flex h-full max-h-full flex-col p-4">
              <div className="dropdown flex-1">
                <SearchWithNavigation
                  searchListRef={peopleListRef}
                  className="input w-full"
                  placeholder="Find person"
                  value={userFilter}
                  onChange={(e) => {
                    toast(e.currentTarget.value);
                    setUserFilter(e.currentTarget.value);
                  }}
                />
                <ul
                  key={dropdownKey}
                  className="dropdown-content menu rounded-box mt-2 w-full bg-base-100 p-2 shadow"
                  ref={peopleListRef}
                >
                  {status === "loading" && (
                    <div className="flex h-full w-full items-center justify-center">
                      <div role="status">
                        <svg
                          aria-hidden="true"
                          className="mr-2 h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  )}
                  {data?.map((user) => {
                    return (
                      <li
                        key={user.id}
                        tabIndex={-1}
                        onClick={() => {
                          toast(user.name);
                          setDropdownKey((o) => o + 1);
                          setUserFilter(user.name ?? "");
                        }}
                      >
                        <a>
                          {user.name}{" "}
                          <span className="text-opacity-60">@{user.id}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <button className="btn-primary btn">Start chat</button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

type ConversationPreviewProps = {
  conversation: Conversation;
};

const ConversationPreview = ({ conversation }: ConversationPreviewProps) => {
  return (
    <>
      <div className="flex h-1/5 cursor-pointer items-center justify-center gap-3 border-b-2 border-base-300 px-4 shadow-md hover:bg-base-200">
        <div className="placeholder avatar">
          <div className="h-12 w-12 rounded-full bg-neutral-focus text-neutral-content ">
            <span>XD</span>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col">
            <div className="text font-bold">Xean Dean</div>
            <div className=" max-w-[300px] truncate">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque
              optio quo maxime perferendis voluptate eos quisquam expedita. Quia
              sed sapiente ad earum iste corporis voluptas, voluptates commodi
              laborum molestiae laboriosam.
            </div>
            <div className="text-end text-sm font-semibold">
              06.01.2022 12:34
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MessagesPage;
