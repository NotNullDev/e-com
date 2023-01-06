import type { Product, User } from "@prisma/client";

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
  currentMessage: string;
  converstations: Conversation[];
};

const MessagesPage = () => {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex h-[500px] w-[1200px] border-t border-indigo-800 shadow-md shadow-indigo-700">
        <div className="flex-1 overflow-y-auto border-r border-indigo-900">
          {/* single start */}
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
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Cumque optio quo maxime perferendis voluptate eos quisquam
                  expedita. Quia sed sapiente ad earum iste corporis voluptas,
                  voluptates commodi laborum molestiae laboriosam.
                </div>
                <div className="text-end text-sm font-semibold">
                  06.01.2022 12:34
                </div>
              </div>
            </div>
          </div>
          {/* single end */}
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

export default MessagesPage;
