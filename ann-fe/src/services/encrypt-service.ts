import {LogManager} from 'aurelia-framework';
import JSEncrypt from 'jsencrypt';
// import JSEncrypt from 'node-jsencrypt';

const logger = LogManager.getLogger('EncryptTools');

const k = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAths59StFxNqXNZsi8Zm9cMTF4S4AKqDPvSGIGigwEkPmVT69PwNFIRufgBI9QAimObnQ2WGDfI1bPxWUMqFDvykwA+qq6CH+jI6APYPzXyyWawE6QFo/Z5o6JELuk0ioT8h51VR4oIzhFVaX9qJtaaCD64mk48Pfch57dH7VHr+xi8QlG0vVWSTNCG8BXC7wqv5hlydddvrZvFDaw9UVEGQwyuwiE+sJBVjx3MmjYT/OfGppptSH/rhngtZPLn+6q5sJt1UkzIKExvHgyJ16tPqTsgX2zzslDuPrwQdPKa1YSvyaC3uXFcPY9gOEFyy53Jcb21/3sTig+apBugt5TwIDAQAB';
export class EncryptService {
  static encrypt(plainText) {
    var jsencrypt = new JSEncrypt({});
    jsencrypt.setPublicKey(k);
    return jsencrypt.encrypt(plainText);
  }
}