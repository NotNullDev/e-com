import type { Product, User } from "@prisma/client";
import * as Dialog from "@radix-ui/react-dialog";
import { useRef } from "react";
import { toast } from "react-hot-toast";
import create from "zustand";
import { immer } from "zustand/middleware/immer";
import SearchWithNavigation from "../components/SearchWithNavigation";
import { trpc } from "../utils/trpc";

type Conversation = {
  id: number;
  product: Product;
  messages: ChatMessage[];
};

type ChatMessage = {
  from: User;
  to: User;
  date: Date;
  content: string;
  product: Product;
};

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

  return (
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
            <div className="flex flex-1 flex-col">
              <SearchWithNavigation
                searchListRef={peopleListRef}
                className="input"
                focusOnCtrlK
                placeholder="Find people"
                onChange={(e) => {
                  toast(e.currentTarget.value);
                }}
              />
            </div>
            <button className="btn-primary btn">Start chat</button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
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
