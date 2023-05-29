import { useId, useState } from "react";

type RatingType = {
  rating: number;
  onClick?: (rating: number) => void;
  editable?: boolean;
};

export const Rating = ({ rating, editable, onClick: callback }: RatingType) => {
  const [currentRating, setCurrentRating] = useState(rating);
  const uuid = useId();

  return (
    <div className="relative" key={currentRating}>
      <div
        className="z-100 rating"
        key={uuid}
        onClick={(e) => e.preventDefault()}
      >
        <input
          name={"rating" + uuid}
          className="hidden"
          checked={currentRating === 0}
          readOnly
        />
        {[...Array(5)].map((_, idx) => {
          return (
            <input
              key={idx}
              type="radio"
              name={"rating" + uuid}
              className={
                "mask mask-star-2 " +
                `${currentRating === 0 ? "" : "bg-orange-400"}`
              }
              checked={idx === currentRating - 1}
              readOnly
              onClick={() => {
                if (editable && callback) {
                  if (idx === currentRating - 1) {
                    setCurrentRating(0);
                    callback(0);
                    return;
                  }
                  setCurrentRating(idx + 1);
                  callback(idx + 1);
                }
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
