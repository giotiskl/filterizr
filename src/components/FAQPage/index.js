import React, { Component } from 'react';
import { Grid, Header, Accordion, Icon } from 'semantic-ui-react';
import qaJSON from './qa.json';

export default class AccordionExampleStyled extends Component {
  state = { activeIndexFAQ: 0, activeIndexCaveats: 0 };

  handleClickFAQ = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndexFAQ } = this.state;
    const newIndex = activeIndexFAQ === index ? -1 : index;

    this.setState({ activeIndexFAQ: newIndex });
  };

  handleClickCaveats = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndexCaveats } = this.state;
    const newIndex = activeIndexCaveats === index ? -1 : index;

    this.setState({ activeIndexCaveats: newIndex });
  };

  render() {
    const { activeIndexFAQ, activeIndexCaveats } = this.state;
    const { faq, caveats } = qaJSON;

    return (
      <Grid className="FAQPage" divided="vertically">
        <Grid.Row columns={1}>
          <Grid.Column mobile={16} computer={8}>
            <Header as="h2">FAQ</Header>
            <Accordion styled fluid>
              {faq.map(({ question, answer }, index) => (
                <React.Fragment key={index}>
                  <Accordion.Title
                    active={activeIndexFAQ === index}
                    index={index}
                    onClick={this.handleClickFAQ}
                  >
                    <Icon name="dropdown" />
                    {question}
                  </Accordion.Title>
                  <Accordion.Content active={activeIndexFAQ === index}>
                    <p dangerouslySetInnerHTML={{ __html: answer }} />
                  </Accordion.Content>
                </React.Fragment>
              ))}
            </Accordion>
          </Grid.Column>
          <Grid.Column mobile={16} computer={8}>
            <Header as="h2">Caveats</Header>
            <Accordion styled fluid>
              {caveats.map(({ question, answer }, index) => (
                <React.Fragment key={index}>
                  <Accordion.Title
                    active={activeIndexCaveats === index}
                    index={index}
                    onClick={this.handleClickCaveats}
                  >
                    <Icon name="dropdown" />
                    {question}
                  </Accordion.Title>
                  <Accordion.Content active={activeIndexCaveats === index}>
                    <p dangerouslySetInnerHTML={{ __html: answer }} />
                  </Accordion.Content>
                </React.Fragment>
              ))}
            </Accordion>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
