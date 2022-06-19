import { getAuth } from 'firebase/auth'

export const initFirebaseAuth = () => {
  return new Promise((resolve) => {
    const unsubscribe = getAuth().onAuthStateChanged((user) => {
      // user オブジェクトを resolve
      resolve(user);
      // 登録解除
      unsubscribe();
    });
  });
};
