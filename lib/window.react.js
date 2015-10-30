if(window) {
  if (!!window.hasOwnProperty("React")){
    window.React = React;
  }

  if(!!window.hasOwnProperty("ReactDom")) {
    window.ReactDom = ReactDom;
  }
}
