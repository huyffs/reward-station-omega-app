export type Merchant = {
  name: String;
}

const merchants: Record<string, Merchant> = {
  '': {
    name: 'Reward'
  },
  starbucks: {
    name: 'Starbucks'
  }
}


export type Merchants = keyof typeof merchants;

export default merchants;