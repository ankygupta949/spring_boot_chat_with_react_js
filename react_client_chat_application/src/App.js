import React, { Component } from 'react';
import ChatMessageBox from './ChatMessageBox/ChatMessageBox'
// Re-using my ErrorBoundary Component 
import ErrorBoundary from 'react-error-boundary';


class App extends Component {
  refreshPage(){
    window.location.reload();
  }

  render() {
    return (
      <ErrorBoundary headerColor="lightseagreen" errorTitle="Server Error" 
      errorText="Unable to not connect you to the Chat Room Server. Please refresh this page and try again!" 
      buttonType={['', 'primary', '', '']} buttonLabel={['', 'Refresh', '', '']} modal={true} autoScrollBodyContent={false}
      customContentStyle={null} onClick={this.refreshPage}>
        <ChatMessageBox />
      </ErrorBoundary>

    );
  }
}

export default App;
