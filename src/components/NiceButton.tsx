import { useRef } from "react";

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
  const currentVal = useRef<number>(initial ?? 1);

  return (
    <>
      <div className="border-100 flex items-center gap-1">
        <button
          className="btm btn-sm text-xl font-bold"
          onClick={() => {
            if (currentVal.current > 0) {
              const c = currentVal.current;
              // if (c === 0 || (min && c === min)) {
              if (c === 0) {
                callback && callback(c);
                return c;
              }
              const newValue = c - 1;
              if (callback) {
                callback(newValue);
              }
              currentVal.current = newValue;
            }
          }}
        >
          -
        </button>
        <input
          className="input  w-32 text-center"
          placeholder="1"
          value={currentVal.current}
          onChange={(e) => {
            let newVal: number | string = e.currentTarget.value;
            if (newVal === "") {
              newVal = 0;
            }
            newVal = Number(newVal);
            if (!newVal && newVal !== 0) {
              return;
            }
            currentVal.current = newVal;
            if (callback) {
              callback(newVal);
            }
            e.currentTarget.focus();
          }}
          onFocus={(e) => e.currentTarget.select()}
        />
        <button
          className="btm btn-sm text-xl font-bold"
          onClick={(e) => {
            const c = currentVal.current;
            const newValue = c + 1;
            if (callback) {
              callback(newValue);
            }
            currentVal.current = newValue;
            e.currentTarget.focus();
          }}
        >
          +
        </button>
      </div>
    </>
  );
};
