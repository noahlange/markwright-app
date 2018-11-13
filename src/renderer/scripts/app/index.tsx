import React from 'react';
import { Grid } from 'semantic-ui-react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { SemanticToastContainer } from 'react-semantic-toasts';

export default class extends React.Component {
  public render() {
    return (
      <>
        <HashRouter>
          <Grid>
            <Grid.Column width={12} style={{ paddingLeft: 0 }}>
              <Grid padded stretched>
                <Grid.Row>
                  <Grid.Column width={16} style={{ paddingLeft: 0 }}>
                    <Switch />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid>
        </HashRouter>
        <SemanticToastContainer position="bottom-right" />
      </>
    );
  }
}
