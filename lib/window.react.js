if(window) {
  if (!!window.hasOwnProperty("React")){
    window.React = React;
  }

  if(!!window.hasOwnProperty("ReactDom")) {
    window.ReactDom = ReactDom;
  }

  if(!!window.hasOwnProperty("injectTapEventPlugin")){
    window.injectTapEventPlugin = injectTapEventPlugin;
  }
}
