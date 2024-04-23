const DEFAULT_URL = "http://www.gstatic.com/generate_204"
const profiles = [
    /**
    * Proxy-group
    * **/
    // Default, DO NOT change.
    { name: "PROXY", proType: "default", type: "select", enable: true, proxy: ["HK_LB", "SG_LB", "US_LB", "JP_LB", "KR_LB", "TW_LB", "TMP"] },
    { name: "AD Block", proType: "default", type: "fallback", enable: true, url: DEFAULT_URL, interval: 86400000, proxy: ["REJECT"] },
    { name: "Black List (GFWlist)", proType: "default", type: "fallback", enable: true, url: DEFAULT_URL, interval: 86400000, proxy: ["DIRECT"] },
    { name: "White List (Avoid Mainland)", proType: "default", type: "fallback", enable: true, url: DEFAULT_URL, interval: 60, proxy: ["PROXY"] },
    { name: "Proxy Strategy", proType: "default", type: "select", enable: true, proxy: ["Black List (GFWlist)", "White List (Avoid Mainland)"] },

    // Custom node groups
    { name: "TMP", proType: "nodeRule", type: "select", enable: true, reg: /^(.*)((?=.*ASYN)(?=.*永久)).*$/g },
    { name: "HK_LB", proType: "nodeRule", type: "load-balance", enable: true, reg: /^(.*)((?=.*港)(?=.*IPLC))|((?=.*Hong Kong)(?=.*Chai Wan))+(.*)$/g },
    { name: "SG_LB", proType: "nodeRule", type: "load-balance", enable: true, reg: /^(.*)((?=.*新加坡)(?=.*高级)(?=.*IEPL))|(SG新加坡)|((?=.*Singapore)(?=.*Central))+(.*)$/g },
    { name: "US_LB", proType: "nodeRule", type: "load-balance", enable: true, reg: /^(.*)((?=.*美国)(?=.*IEPL))|(US美国)|((?=.*United States)(?=.*Washington))+(.*)$/g },
    { name: "JP_LB", proType: "nodeRule", type: "load-balance", enable: true, reg: /^(.*)((?=.*日本)(?=.*ソフトバンク))|(JP日本)|((?=.*Japan)(?=.*Tokyo))+(.*)$/g },
    { name: "KR_LB", proType: "nodeRule", type: "load-balance", enable: true, reg: /^(.*)((?=.*韩国)(?=.*游戏))|((?=.*South Korea)(?=.*Seoul))+(.*)$/g },
    { name: "TW_LB", proType: "nodeRule", type: "load-balance", enable: true, reg: /^(.*)((?=.*台湾)(?=.*游戏))|(TW台湾)|((?=.*Taiwan)(?=.*Hsinchu))+(.*)$/g },
    { name: "NF_HK", proType: "nodeRule", type: "load-balance", enable: true, reg: /^(.*)(?=.*香港)(?=.*HBO).*$/g },
    { name: "NF_TW", proType: "nodeRule", type: "load-balance", enable: true, reg: /^(.*)(?=.*台湾)(?=.*Netflix).*$/g },
    { name: "NF_KR", proType: "nodeRule", type: "load-balance", enable: true, reg: /^(.*)(?=.*韩国)(?=.*Netflix).*$/g },
    { name: "NF_AU", proType: "nodeRule", type: "load-balance", enable: true, reg: /^(.*)(?=.*澳大利亚)(?=.*IPLC).*$/g },

    //Custom rule
    { name: "Social Media", proType: "custom", type: "select", enable: true, proxy: ["HK_LB", "SG_LB", "US_LB", "JP_LB", "KR_LB", "TW_LB"] },
    { name: "Netflix", proType: "custom", type: "select", enable: true, proxy: ["NF_HK", "NF_TW", "NF_KR", "NF_AU"] },
    { name: "BattleNet", proType: "custom", type: "select", enable: true, proxy: ["HK_LB", "KR_LB", "DIRECT"] },

    /**
    * Rule
    * **/
    { name: "34.84.234.120/24", proType: "rule", type: "IP-CIDR", rule: "DIRECT" },
    { name: "59.153.40.90/24", proType: "rule", type: "IP-CIDR", rule: "DIRECT" },
    { name: "battle_net", proType: "rule", type: "RULE-SET", rule: "BattleNet" },
    { name: "applications", proType: "rule", type: "RULE-SET", rule: "DIRECT" },
    { name: "reddit.com", proType: "rule", type: "DOMAIN-SUFFIX", rule: "TW_LB" },
    { name: "clash.razord.top", proType: "rule", type: "DOMAIN", rule: "DIRECT" },
    { name: "yacd.haishan.me", proType: "rule", type: "DOMAIN", rule: "DIRECT" },
    { name: "org.hk", proType: "rule", type: "DOMAIN-SUFFIX", rule: "SG_LB" },
    { name: "go.kr", proType: "rule", type: "DOMAIN-SUFFIX", rule: "DIRECT" },
    { name: "custom_direct", proType: "rule", type: "RULE-SET", rule: "DIRECT" },
    { name: "tiktok.com", proType: "rule", type: "DOMAIN-SUFFIX", rule: "Social Media" },
    { name: "private", proType: "rule", type: "RULE-SET", rule: "DIRECT" },
    { name: "reject", proType: "rule", type: "RULE-SET", rule: "AD Block" },
    { name: "icloud", proType: "rule", type: "RULE-SET", rule: "PROXY" },
    { name: "apple", proType: "rule", type: "RULE-SET", rule: "PROXY" },
    { name: "google", proType: "rule", type: "RULE-SET", rule: "DIRECT" },
    { name: "custom_proxy", proType: "rule", type: "RULE-SET", rule: "PROXY" },
    { name: "ai", proType: "rule", type: "RULE-SET", rule: "SG_LB" },
    { name: "media", proType: "rule", type: "RULE-SET", rule: "Netflix" },
    { name: "tld-not-cn", proType: "rule", type: "RULE-SET", rule: "PROXY" },
    { name: "gfw", proType: "rule", type: "RULE-SET", rule: "PROXY" },
    { name: "greatfire", proType: "rule", type: "RULE-SET", rule: "PROXY" },
    { name: "telegramcidr", proType: "rule", type: "RULE-SET", rule: "PROXY" },
    { name: "lancidr", proType: "rule", type: "RULE-SET", rule: "DIRECT" },
    { name: "cncidr", proType: "rule", type: "RULE-SET", rule: "DIRECT" },
    { name: "LAN", proType: "rule", type: "GEOIP", rule: "DIRECT" },
    { name: "CN", proType: "rule", type: "GEOIP", rule: "DIRECT" },
    { name: "direct", proType: "rule", type: "RULE-SET", rule: "DIRECT" },
    { name: "proxy", proType: "rule", type: "RULE-SET", rule: "Proxy Strategy" },
    { name: "root", proType: "rule", type: "MATCH", rule: "Proxy Strategy" },

    /**
    * Rule-providers
    */

    { name: "reject", proType: "rule_provider", type: "http", behavior: "domain", interval: 86400, url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/reject.txt" },
    { name: "icloud", proType: "rule_provider", type: "http", behavior: "domain", interval: 86400, url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/icloud.txt" },
    { name: "apple", proType: "rule_provider", type: "http", behavior: "domain", interval: 86400, url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/apple.txt" },
    { name: "google", proType: "rule_provider", type: "http", behavior: "domain", interval: 86400, url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/google.txt" },
    { name: "proxy", proType: "rule_provider", type: "http", behavior: "domain", interval: 86400, url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/proxy.txt" },
    { name: "direct", proType: "rule_provider", type: "http", behavior: "domain", interval: 86400, url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/direct.txt" },
    { name: "private", proType: "rule_provider", type: "http", behavior: "domain", interval: 86400, url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/private.txt" },
    { name: "gfw", proType: "rule_provider", type: "http", behavior: "domain", interval: 86400, url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/gfw.txt" },
    { name: "greatfire", proType: "rule_provider", type: "http", behavior: "domain", interval: 86400, url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/greatfire.txt" },
    { name: "tld-not-cn", proType: "rule_provider", type: "http", behavior: "domain", interval: 86400, url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/tld-not-cn.txt" },
    { name: "telegramcidr", proType: "rule_provider", type: "http", behavior: "domain", interval: 86400, url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/telegramcidr.txt" },
    { name: "cncidr", proType: "rule_provider", type: "http", behavior: "domain", interval: 86400, url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/cncidr.txt" },
    { name: "lancidr", proType: "rule_provider", type: "http", behavior: "domain", interval: 86400, url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/lancidr.txt" },
    { name: "applications", proType: "rule_provider", type: "http", behavior: "domain", interval: 86400, url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/applications.txt" },
    { name: "custom_direct", proType: "rule_provider", type: "http", behavior: "domain", interval: 86400, url: "https://raw.gitmirror.com/Gavinin/science_internet/master/rules/custom_direct.txt" },
    { name: "custom_proxy", proType: "rule_provider", type: "http", behavior: "domain", interval: 86400, url: "https://raw.gitmirror.com/Gavinin/science_internet/master/rules/custom_proxy.txt" },
    { name: "ai", proType: "rule_provider", type: "http", behavior: "domain", interval: 86400, url: "https://raw.gitmirror.com/Gavinin/science_internet/master/rules/ai.txt" },
    { name: "media", proType: "rule_provider", type: "http", behavior: "domain", interval: 86400, url: "https://raw.gitmirror.com/Gavinin/science_internet/master/rules/media.txt" },
    { name: "battle_net", proType: "rule_provider", type: "http", behavior: "domain", interval: 86400, url: "https://raw.gitmirror.com/Gavinin/science_internet/master/rules/battle_net.txt" },

]
var rawObj = {}
function main(params) {
    initDns(params)
    delParams(params)

    rawObj = params
   
    const groups = params["proxy-groups"] = [];
    groups.push(...groupProcessor(params))

    const rules = params["rules"] = [];
    rules.push(...ruleProcessor())

    const ruleProviders = params["rule-providers"] = ruleProviderProcessor();

    console.log(params)
    return params;
}


function groupGen(reg) {
    let group = []
    rawObj.proxies.forEach((node) => {
        if (node.name.match(reg)) {
            group.push(node.name)
        }
    })
    return group
}

function nodeStructGen(name, type, proxies, testURL = null, testInterval = null) {
    let group = {}
    group.name = name
    group.type = type
    if (testURL != null) {
        group.url = testURL
    }
    if (testInterval != null) {
        group.interval = testInterval
    }

    group.proxies = proxies.length > 0 ? proxies : ["DIRECT"]


    return group
}

function groupNodeGen(name, type, reg) {
    return nodeStructGen(name, type, groupGen(reg), DEFAULT_URL, 60)
}

function groupNodeProcessor() {
    let groups = []
    profiles.forEach((profile) => {
        if (profile.proType == "nodeRule" && profile.enable) {
            groups.push(groupNodeGen(profile.name, profile.type, profile.reg))
        }
    })
    return groups
}

function groupDefaultProcessor() {
    let groups = []
    profiles.forEach((profile) => {
        if (profile.proType == "default" && profile.enable) {
            groups.push(nodeStructGen(profile.name, profile.type, profile.proxy, profile.url, profile.interval))

        }
    })
    return groups
}

function groupCustomProcessor() {
    let groups = []
    profiles.forEach((profile) => {
        if (profile.proType == "custom" && profile.enable) {
            groups.push(nodeStructGen(profile.name, profile.type, profile.proxy))
        }
    })
    return groups
}

function groupProcessor(params) {
    let groups = []
    groups.push(...groupDefaultProcessor())
    groups.push(...groupNodeProcessor())
    groups.push(...groupCustomProcessor())
    return groups
}

function ruleProcessor() {
    let rules = []
    profiles.forEach((profile) => {
        if (profile.proType == "rule") {
            if (profile.type !== "MATCH") {
                rules.push(profile.type + "," + profile.name + "," + profile.rule)
            } else {
                rules.push(profile.type + ","  + profile.rule)
            }
        }
    })
    return rules
}
function ruleProviderProcessor() {
    let rulesProviderz = {}
    profiles.forEach((profile) => {
        if (profile.proType == "rule_provider") {
            let ruleProvider = {}
            ruleProvider.type = profile.type
            ruleProvider.behavior = profile.behavior
            ruleProvider.url = profile.url
            ruleProvider.path = "./ruleset/" + profile.name + ".yaml"
            ruleProvider.interval = profile.interval
            rulesProviderz[profile.name] = ruleProvider
        }
    })

    return rulesProviderz
}

function initDns(params) {
    params["dns"] = {
        "enable": true,
        "ipv6": false,
        "listen": "0.0.0.0:1053",
        "default-nameserver": [
            "223.5.5.5",
            "119.29.29.29",
            "114.114.114.114"
        ],
        "enhanced-mode": "fake-ip",
        "fake-ip-range": "28.0.0.1/8",
        "use-hosts": true,
        "nameserver": [
            "tls://223.5.5.5:853",
            "tls://223.6.6.6:853",
            "https://doh.pub/dns-query",
            "https://dns.alidns.com/dns-query"
        ],
        "fallback": [
            "https://doh.dns.sb/dns-query",
            "https://dns.cloudflare.com/dns-query",
            "https://dns.twnic.tw/dns-query",
            "tls://8.8.4.4:853"
        ],
        "fallback-filter": {
            "geoip": true,
            "ipcidr": [
                "240.0.0.0/4",
                "0.0.0.0/32"
            ]
        }
    }
}


function delParams(params) {
    delete params["cfw-conn-break-strategy"]
    delete params["experimental"]
    delete params["hosts"]
    delete params["cfw-latency-timeout"]
    delete params["cfw-latency-url"]
    delete params["clash-for-android"]
    delete params["udp"]


}
