export interface IAddressDomain {
  domain: string;
  url: string;
  name: string;
  aliases?: string[];
}

const addressDomains: IAddressDomain[] = [
  {
    domain: "gmail.com",
    url: "https://mail.google.com/",
    name: "Gmail",
  },
  {
    domain: "yandex.ru",
    url: "https://mail.yandex.ru/",
    name: "Яндекс.Почта",
    aliases: ["ya.ru"],
  },
  {
    domain: "mail.ru",
    url: "https://e.mail.ru/",
    name: "Почта Mail.ru",
    aliases: ["inbox.ru", "internet.ru", "bk.ru", "list.ru", "vk.com"],
  },
  {
    domain: "rambler.ru",
    url: "https://mail.rambler.ru/",
    name: "Рамблер",
    aliases: ["ro.ru", "myrambler.ru", "autorambler.ru", "rambler.ua"]
  },
  {
    domain: "yahoo.com",
    url: "https://mail.yahoo.com/",
    name: "Yahoo",
  },
  {
    domain: "psu.ru",
    url: "https://mail.psu.ru/",
    name: "Почта ПГНИУ",
  },

];

export const getEmailAddressDomain = (address: string) => {
  const domain = address.split("@").at(-1)!;
  const data = addressDomains.find(
    ($domain) =>
      $domain.domain === domain ||
      ($domain.aliases && $domain.aliases.includes(domain)),
  );
  if (data) return data;
  return {
    domain,
    name: domain,
    url: domain
  }
};
