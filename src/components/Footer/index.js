import React from 'react';
import { Container } from 'semantic-ui-react';

import './Footer.scss';

const ContainerExampleText = () => (
  <Container fluid className="Footer" textAlign="center">
    <footer>
      Made by <a href="https://yiotis.net">Yiotis Kaltsikis</a>. MIT License.
    </footer>
  </Container>
);

export default ContainerExampleText;
