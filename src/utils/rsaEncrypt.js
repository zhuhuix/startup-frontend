import JSEncrypt from 'jsencrypt/bin/jsencrypt'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDFYvmTuDrKdSFWHyUpcb1HadIE\n' +
'U/6MlchW18kSxE61eCmxC6tbL08n+dS20C/eOVwKpvH/1K0E34wcNtajoQgWPjFG\n' +
'RKKceDbw36/M5P+A1fKMZVRKleb/YIIkHQmB7Gs09acWKpSGfcYzeY/uAwoWBTOr\n' +
'1z7ylmdMzg+Aeub9SQIDAQAB'

const privateKey = 'MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBAMVi+ZO4Osp1IVYf\n' +
'JSlxvUdp0gRT/oyVyFbXyRLETrV4KbELq1svTyf51LbQL945XAqm8f/UrQTfjBw2\n' +
'1qOhCBY+MUZEopx4NvDfr8zk/4DV8oxlVEqV5v9ggiQdCYHsazT1pxYqlIZ9xjN5\n' +
'j+4DChYFM6vXPvKWZ0zOD4B65v1JAgMBAAECgYEAntdWJnTUAsadbBOmMSLRgd17\n' +
'X3ZEWtfSH2iI6+xDtq8bRdkxLTD2DyJx9ie0zaz1D7Fm/0wja8+FjdLniUf2G5xO\n' +
'YnqnCaAa8ZOSvah4B0efykjujzFzEkX0CrgYjGhn5HhWFyha3qenEYkaSGYc/rYj\n' +
'qPq1c+gONM2YPVmXzz0CQQD6V4Azt5YX3iwq7LdCtqufARDTZy2sqRxcxIqatTun\n' +
'7VXH/gyN7NwybxNLtzUh/oHRukNzrtGMtgpnhENF7CavAkEAydkSJiH/BFCz0jDd\n' +
'EXMZQs+rZhR4JMuaddqdOMiV95T80jnT8CUsLrPZALCYh4xkj/ZbPMWYCdAvfDFl\n' +
'G8CZhwJBAKKoM95mjJlZe+0v/SrVsdEQSjRxt9WV053a/gvjca18od3eDZ4xpikG\n' +
'zszFbzp1OThiA+2oSvNYXI5B+8v00nUCQQC56/ZppXrOsL9R5qxaPFiST9Mizcv0\n' +
'qI337IxRF4H7cQKHabisRLEzu3kwx3lXsZuXd2aGzcLDlz2F+cGWFIvVAkBOyFVr\n' +
'nnGl1jO5WY9mWqMD3w7othS5J8gM3X3byURcsyeQejQZiXnCV086hzAxzCYRA39o\n' +
'0BU0Gbk4JeEW1p+B'

// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对需要加密的数据进行加密
}

// 解密
export function decrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey)
  return encryptor.decrypt(txt)
}

