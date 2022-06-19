<template>
  <div>
    <p class="text-center">ログインまたは登録</p>
    <div id="firebaseui-auth-container"></div>
    <div id="loader">Loading...</div>
  </div>
</template>

<script>
import firebase from 'firebase/compat'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import {getAuth} from "firebase/auth"

export default {
  name: "FirebaseAuth",
  mounted() {
//getAuth().on
    const uiConfig = {

      callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
          const user = authResult.user
          const credential = authResult.credential
          const isNewUser = authResult.additionalUserInfo.isNewUser
          const providerId = authResult.additionalUserInfo.providerId
          const operationType = authResult.operationType

          return true;
        },
        uiShown: function () {
          document.getElementById('loader').style.display = 'none';
        }
      },
      // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
      signInFlow: 'redirect',
      signInSuccessUrl: '/',
      signInOptions: [
        {
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
          requireDisplayName: true,
        },
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        "microsoft.com"
      ],
    };

    let ui = firebaseui.auth.AuthUI.getInstance();
    if (!ui) ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container', uiConfig);
  }
}
</script>

<style scoped>

</style>
