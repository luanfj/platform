import React from 'react';
import { Card, Image } from 'semantic-ui-react';
import { decrypt } from '../../util/privacy';


export default class Message extends React.Component {
  render() {
    const avatarPlaceholder = 'data:image/jpeg;base64,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';
    const ownerAddress = this.props.ownerAddress.toLowerCase();
    const isOwnerLastMessage = (this.props.prev && !this.props.opponent &&
          this.props.prev.sender.username === ownerAddress &&
          this.props.next &&
          this.props.next.sender.username !== ownerAddress) ||
          (this.props.prev && !this.props.opponent &&
            this.props.next &&
          this.props.prev.sender.username !== ownerAddress &&
          this.props.next.sender.username !== ownerAddress) || (
      !this.props.next && this.props.message.sender.username === ownerAddress) || (
      !this.props.prev && this.props.message.sender.username === ownerAddress);
    const isOpponentLastMessage = (this.props.prev && this.props.opponent &&
          this.props.next &&
          this.props.prev.sender.username === this.props.opponent.username &&
          this.props.next.sender.username !== this.props.opponent.username) ||
          (this.props.prev && this.props.opponent &&
          this.props.next &&
          this.props.prev.sender.username !== this.props.opponent.username &&
          this.props.next.sender.username !== this.props.opponent.username) || (
      !this.props.next && this.props.message.sender.username !== ownerAddress) || (
      !this.props.prev && this.props.message.sender.username !== ownerAddress);
    return (
      <div
        className={`message ${this.props.opponent ? 'opponent' : 'owner'}`}
        style={this.props.opponent ? { textAlign: 'left' } : { textAlign: 'right' }}
      >
        {(() => {
          if (this.props.opponent) {
            if (this.props.prev) {
              if (this.props.prev.sender.username === this.props.opponent.username) {
                return null;
              }
            }
            return (<Image
              style={{
                display: 'inline-flex',
                width: '3em',
                height: '3em',
                marginRight: '2em',
              }}
              avatar
              src={
                this.props.opponent.avatar ?
                  `https://ipfs.io/ipfs/${this.props.opponent.avatar}` :
                  avatarPlaceholder
              }
            />);
          }
          return null;
        })()
        }
        { isOwnerLastMessage ?
          <small style={{ color: 'rgb(175, 175, 175)', marginRight: '1em' }}>{
            this.props.toAgoDate(this.props.message.created)
          }
          </small> :
          null
        }
        <Card
          style={(() => {
            let style = { wordBreak: 'break-word' };
            if (this.props.prev && this.props.opponent) {
              const opponentUsername = this.props.opponent.username;
              if (this.props.prev.sender.username === opponentUsername) {
                style = Object.assign({}, style, { marginLeft: '5em', marginTop: '0.1em', borderTopLeftRadius: '5px' });
              }
              if (this.props.next && this.props.next.sender.username === opponentUsername) {
                style = Object.assign({}, style, { borderBottomLeftRadius: '5px' });
              }
            } else if (this.props.prev) {
              if (this.props.prev.sender.username === ownerAddress) {
                style = Object.assign({}, style, { borderTopRightRadius: '5px' });
              }
              if (this.props.next && this.props.next.sender.username === ownerAddress) {
                style = Object.assign({}, style, { borderBottomRightRadius: '5px' });
              }
            }
            return style;
          })()}
        >
          {(() => {
            const encryptedText = this.props.message.text;
            const encryptedBuffer = Buffer.from(encryptedText, 'base64');
            const decryptedBuffer = decrypt(this.props.decryptionKey, encryptedBuffer);
            return decryptedBuffer.toString('utf8');
          })()}
        </Card>
        { isOpponentLastMessage ?
          <small style={{ color: 'rgb(175, 175, 175)', marginLeft: '1em' }}>{
            this.props.toAgoDate(this.props.message.created)}
          </small> :
          null
        }
      </div>
    );
  }
}
