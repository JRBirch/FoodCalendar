import { Food } from "../../pages/FoodList/FoodList";
import CreatedFood from "../CreatedFood/CreatedFood";

import Styles from "./FoodCategoryStyles.module.css";

type FoodCategoryInput = {
  categoryName: string;
  foods: Food[];
  removeItem: (category: string, food: Food) => Promise<void>;
  updateItem: (category: string, food: Food, skipSetMethod?: boolean) => Promise<void>;
};

const FoodCategory = ({ categoryName, foods, removeItem, updateItem }: FoodCategoryInput) => {
  return (
    <>
      <div className={Styles.category}>
        <h2 className={Styles.category_heading}>{categoryName}</h2>
        {foods.map((food) => {
          return (
            <CreatedFood
              key={food._id}
              food={food}
              removeItem={removeItem}
              updateItem={updateItem}
            />
          );
        })}
      </div>
    </>
  );
};

export default FoodCategory;
