import { create } from "zustand";

export type UserStoreProps = {
  user_id: number;
};

// NOTE needs authorization features in future
const useUserStore = create<UserStoreProps>((set, get) => ({
  user_id: 1,
}));

export default useUserStore;
