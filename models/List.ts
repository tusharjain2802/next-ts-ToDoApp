import { Schema, model, models } from "mongoose";

const listSchema = new Schema({
  name: { type: String, required: true },
  items: { type: [String], default: [] },
});

const List = models.List || model("List", listSchema);
export default List;
