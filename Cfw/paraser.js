module.exports.parse = (raw, { yaml }) => {
    const DEFAULT_URL = "http://www.gstatic.com/generate_204"

    const profiles=[
      /**
      * Proxy-group
      * **/
      // Default, DO NOT change.
      {name:"PROXY",proType:"default",type:"select",enable:true,proxy:["HK_LB","SG_LB","US_LB","JP_LB","KR_LB","TW_LB"]},
      {name:"AD Block",proType:"default",type:"fallback",enable:true,url:DEFAULT_URL,interval:86400000,proxy:["REJECT"]},
      {name:"Black List (GFWlist)",proType:"default",type:"fallback",enable:true,url:DEFAULT_URL,interval:86400000,proxy:["DIRECT"]},
      {name:"White List (Avoid Mainland)",proType:"default",type:"fallback",enable:true,url:DEFAULT_URL,interval:60,proxy:["PROXY"]},
      {name:"Proxy Strategy",proType:"default",type:"select",enable:true,proxy:["Black List (GFWlist)","White List (Avoid Mainland)"]},

      // Custom node
      {name:"HK_LB",proType:"node",type:"load-balance",enable:true,reg:/^(?=.*港)(?=.*IPLC)|(?=.*Next generation AnyPath)+(.*)$/g},
      {name:"SG_LB",proType:"node",type:"load-balance",enable:true,reg:/^(.*)((?=.*新加坡)(?=.*高级)(?=.*IEPL))|(SG新加坡)+(.*)$/g},
      {name:"US_LB",proType:"node",type:"load-balance",enable:true,reg:/^(.*)((?=.*美国)(?=.*IEPL))|(US美国)+(.*)$/g},
      {name:"JP_LB",proType:"node",type:"load-balance",enable:true,reg:/^(.*)((?=.*日本)(?=.*ソフトバンク))|(JP日本)+(.*)$/g},
      {name:"KR_LB",proType:"node",type:"load-balance",enable:true,reg:/^(.*)(?=.*韩国)(?=.*游戏).*$/g},
      {name:"TW_LB",proType:"node",type:"load-balance",enable:true,reg:/^(.*)((?=.*台湾)(?=.*游戏))|(TW台湾)+(.*)$/g},

      //Custom rule
      {name:"Social Media",proType:"custom",type:"select",enable:true,proxy:["HK_LB","SG_LB","US_LB","JP_LB","KR_LB","TW_LB"]},
      {name:"BattleNet",proType:"custom",type:"select",enable:true,proxy:["HK_LB","KR_LB","DIRECT"]},

      /**
      * Rule
      * **/
      { name: "applications", proType: "rule", type: "RULE-SET", rule: "DIRECT" },
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
      { name: "media", proType: "rule", type: "RULE-SET", rule: "SG_LB" },
      { name: "battle_net", proType: "rule", type: "RULE-SET", rule: "BattleNet" },
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

      {name:"reject",proType: "rule_provider",type: "http",behavior:"domain",interval: 86400,url:"https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/reject.txt"},
      {name:"icloud",proType: "rule_provider",type: "http",behavior:"domain",interval: 86400,url:"https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/icloud.txt"},
      {name:"apple",proType: "rule_provider",type: "http",behavior:"domain",interval: 86400,url:"https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/apple.txt"},
      {name:"google",proType: "rule_provider",type: "http",behavior:"domain",interval: 86400,url:"https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/google.txt"},
      {name:"proxy",proType: "rule_provider",type: "http",behavior:"domain",interval: 86400,url:"https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/proxy.txt"},
      {name:"direct",proType: "rule_provider",type: "http",behavior:"domain",interval: 86400,url:"https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/direct.txt"},
      {name:"private",proType: "rule_provider",type: "http",behavior:"domain",interval: 86400,url:"https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/private.txt"},
      {name:"gfw",proType: "rule_provider",type: "http",behavior:"domain",interval: 86400,url:"https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/gfw.txt"},
      {name:"greatfire",proType: "rule_provider",type: "http",behavior:"domain",interval: 86400,url:"https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/greatfire.txt"},
      {name:"tld-not-cn",proType: "rule_provider",type: "http",behavior:"domain",interval: 86400,url:"https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/tld-not-cn.txt"},
      {name:"telegramcidr",proType: "rule_provider",type: "http",behavior:"domain",interval: 86400,url:"https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/telegramcidr.txt"},
      {name:"cncidr",proType: "rule_provider",type: "http",behavior:"domain",interval: 86400,url:"https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/cncidr.txt"},
      {name:"lancidr",proType: "rule_provider",type: "http",behavior:"domain",interval: 86400,url:"https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/lancidr.txt"},
      {name:"applications",proType: "rule_provider",type: "http",behavior:"domain",interval: 86400,url:"https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/applications.txt"},
      {name:"custom_direct",proType: "rule_provider",type: "http",behavior:"domain",interval: 86400,url:"https://raw.gitmirror.com/Gavinin/science_internet/master/rules/custom_direct.txt"},
      {name:"custom_proxy",proType: "rule_provider",type: "http",behavior:"domain",interval: 86400,url:"https://raw.gitmirror.com/Gavinin/science_internet/master/rules/custom_proxy.txt"},
      {name:"ai",proType: "rule_provider",type: "http",behavior:"domain",interval: 86400,url:"https://raw.gitmirror.com/Gavinin/science_internet/master/rules/ai.txt"},
      {name:"media",proType: "rule_provider",type: "http",behavior:"domain",interval: 86400,url:"https://raw.gitmirror.com/Gavinin/science_internet/master/rules/media.txt"},
      {name:"battle_net",proType: "rule_provider",type: "http",behavior:"domain",interval: 86400,url:"https://raw.gitmirror.com/Gavinin/science_internet/master/rules/battle_net.txt"},

    ]


    function groupGen(reg) {
        let group = []
        rawObj.proxies.forEach((node) => {
            if (node.name.match(reg)) {
                group.push(node.name)
            }
        })
        return group
    }

    function nodeStructGen(name, type, proxies = null, testURL = null, testInterval = null) {
        let group = {}
        group.name = name
        group.type = type
        if (testURL != null) {
            group.url = testURL
        }
        if (testInterval != null) {
            group.interval = testInterval
        }

        group.proxies = proxies


        return group
    }

    function groupNodeGen(name, type, reg) {
        return nodeStructGen(name, type, groupGen(reg), DEFAULT_URL, 60)
    }

    function groupNodeProcessor() {
        let groups = []
        profiles.forEach((profile) => {
            if (profile.proType == "node" && profile.enable) {
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

    function groupProcessor() {
        let groups = []
        groups.push(...groupNodeProcessor())
        groups.push(...groupDefaultProcessor())
        groups.push(...groupCustomProcessor())
        return groups
    }

    function ruleProcessor() {
        let rules = []
        profiles.forEach((profile) => {
            if (profile.proType == "rule" ) {
                if (profile.type!=="MATCH"){
                    rules.push(profile.type+","+profile.name+","+profile.rule)
                }else {
                    rules.push(profile.type+","+profile.name+","+profile.rule)
                }
            }
        })
        return rules
    }
    function ruleProviderProcessor() {
        let rulesProviderz = {}
        profiles.forEach((profile) => {
            if (profile.proType == "rule_provider" ) {
                let ruleProvider = {}
                ruleProvider.type = profile.type
                ruleProvider.behavior = profile.behavior
                ruleProvider.url = profile.url
                ruleProvider.path = "./ruleset/"+profile.name+".yaml"
                ruleProvider.interval = profile.interval
                rulesProviderz[profile.name] = ruleProvider
            }
        })

        return rulesProviderz
    }

    const rawObj = yaml.parse(raw)
    const groups = []
    const rules = []
    var proxyProviders = {}
    var ruleProviders = {}

    groups.push(...groupProcessor())
    rules.push(...ruleProcessor())
    ruleProviders = ruleProviderProcessor()

    return yaml.stringify({...rawObj, 'proxy-groups': groups, rules,'proxy-providers':proxyProviders,'rule-providers':ruleProviders})
}