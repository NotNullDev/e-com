import { useState } from "react";

export type NiceButtonProps = {
  className?: string;
  callback?: (currentValue: number) => void;
  min?: number;
  max?: number;
  initial?: number;
};

export const NiceButton = ({
  callback,
  min,
  max,
  initial,
}: NiceButtonProps) => {
  const [currentVal, setCurrentVal] = useState(initial ?? 1);

  return (
    <>
      <div className="border-100 flex items-center gap-1">
        <button
          className="btm btn-sm text-xl font-bold"
          onClick={() => {
            if (currentVal > 0) {
              setCurrentVal((c) => {
                if (c === 0 || (min && c === min)) {
                  callback && callback(c);
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
          className="input  w-32 text-center"
          placeholder="1"
          value={currentVal}
          onChange={(e) => {
            let newVal: number | string = e.currentTarget.value;
            if (newVal === "") {
              newVal = 0;
            }
            newVal = Number(newVal);
            if (!newVal && newVal !== 0) {
              return;
            }
            setCurrentVal(newVal);
            if (callback) {
              callback(newVal);
            }
          }}
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
