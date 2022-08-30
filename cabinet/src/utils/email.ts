export default {
  _disposableEmailDomains: [
    'nwytg.net',
    'cndps.com',
    '20minutemail.it',
    'yomail.info',
    'gfmail.cf',
    'cowcell.com',
    '22office.com',
    'vmani.com',
    'trashmail.ws',
    'trashmail.com',
    'getnada.com',
    'mail-apps.com',
    'nanofielznan3s5bsvp.cf',
    'cu8wzkanv7.cf',
    'mjut.ml',
    '5vlimcrvbyurmmllcw0.tk',
    'modejudnct4432x.cf',
    'e5r6ynr5.ga',
    'qnuqgrfujukl2e8kh3o.ga',
    'smileyet.tk',
    '7bhmsthext.ga',
    'kalemproje.com',
    'ciweltrust33deep.tk',
    'd75d8ntsa0crxshlih.cf',
    'orpxp547tsuy6g.gq',
    'sharklasers.com',
    'guerrillamail.info',
    'grr.la',
    'guerrillamail.biz',
    'guerrillamail.com',
    'guerrillamail.de',
    'guerrillamail.net',
    'guerrillamail.org',
    'guerrillamailblock.com',
    'pokemail.net',
    'spam4.me',
    'plutocow.com'
  ],
  _validateCorrectMail(email: string) {
    const rEmail = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
    return rEmail.test(email);
  },
  _validateDisposableMail(email: string) {
    var arrMail = email.split('@');
    var mailDomain = arrMail[arrMail.length - 1];
    return !!this._disposableEmailDomains.filter(domain => domain == mailDomain);
  },
  isValid(email: string) {
    if (!this._validateCorrectMail(email)) return 'You should enter correct email';

    if (!this._validateDisposableMail(email)) return "You shouldn't use disposable email";

    return '';
  }
};
