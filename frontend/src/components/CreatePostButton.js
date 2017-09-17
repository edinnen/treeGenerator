import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import { Button, Modal, FormGroup, ControlLabel, FormControl, Alert } from 'react-bootstrap/lib';
import Urls from '../util/Urls.js';

class CreatePostButton extends Component {
  constructor(props) {
    super(props);
    this.state = { showModal: false, sentence: '', structure: '', isLoading: false, errors: [] };
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  handleChange(key, e) {
    const newState = {};
    newState[key] = e.target.value;
    this.setState(newState);
  }

  checkInput() {
    const errors = [];
    if (this.state.sentence.length === 0) {
      errors.push('Sentence cannot be blank.');
    }

    if (this.state.structure.length === 0) {
      errors.push('Structure cannot be blank.');
    }

    return errors;
  }

  createPost() {
    const { sentence, structure } = this.state;
    this.setState({ isLoading: true, errors: [] });
    const errors = this.checkInput();
    if (errors.length === 0) {
      axios.post(`${Urls.api}/posts`, {
        Sentence: sentence,
        Structure: structure,
      })
        .then((res) => {
          this.props.addPost(res.data);
          this.setState({ isLoading: false, sentence: '', structure: '', showModal: false, errors: [] });
        },
      )
        .catch((err) => {
          this.setState({ isLoading: false, errors: [err.message] });
        },
      );
    } else {
      this.setState({ isLoading: false, errors });
    }
  }

  makeModalErrors() {
    const { errors } = this.state;
    if (errors.length > 0) {
      return (
        <Alert bsStyle="warning">
          {this.state.errors.join('\n')}
        </Alert>
      );
    }

    return <div />;
  }

  render() {
    const { showModal, isLoading } = this.state;
    return (
      <div>
        <Button bsStyle="primary" onClick={this.open.bind(this)}>Create Post</Button>
        <Modal show={showModal} onHide={this.close.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>Create Post, yo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.makeModalErrors()}
            <form>
              <FormGroup>
                <ControlLabel>Sentence</ControlLabel>
                <FormControl
                  type="text"
                  value={this.state.sentence}
                  placeholder="Enter sentence to analyze, yo"
                  onChange={this.handleChange.bind(this, 'sentence')}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Structure</ControlLabel>
                <FormControl
                  type="text"
                  value={this.state.structure}
                  placeholder="Enter structure to display"
                  onChange={this.handleChange.bind(this, 'structure')}
                />
              </FormGroup>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={this.createPost.bind(this)}
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

CreatePostButton.propTypes = {
  addPost: PropTypes.func.isRequired,
};

export default CreatePostButton;
