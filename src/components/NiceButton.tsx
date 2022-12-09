import { useState } from "react";

export type NiceButtonProps = {
  className?: string;
  callback?: (currentValue: number) => void;
  min?: number;
  max?: number;
};

export const NiceButton = ({ callback, min, max }: NiceButtonProps) => {
  const [currentVal, setCurrentVal] = useState(1);

  return (
    <>
      <div>
        <button
          className="btm btn-sm text-xl font-bold"
          onClick={() => {
            if (currentVal > 0) {
              setCurrentVal((c) => {
                if (c === 0 || (min && c === min)) {
                  return c;
                }
                const newValue = --c;
                if (callback) {
                  callback(newValue);
                }
                return newValue;
              });
            }
          }}
        >
          -
        </button>
        <input
          className="input w-[60px] text-center"
          placeholder="1"
          value={currentVal}
          onFocus={(e) => e.currentTarget.select()}
        />
        <button
          className="btm btn-sm text-xl font-bold"
          onClick={() => {
            setCurrentVal((c) => {
              if (max && c === max) {
                return c;
              }
              const newValue = ++c;
              if (callback) {
                callback(newValue);
              }
              return newValue;
            });
          }}
        >
          +
        </button>
      </div>
    </>
  );
};
