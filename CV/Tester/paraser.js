function main(params){
    if (!params.proxies) return params;
    console.log(params)
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
        {name:"HK_LB",proType:"node",type:"load-balance",enable:true,reg:/^(.*)(?=.*港)(?=.*IPLC).*$/g},
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
            if (profile.proType === "node" && profile.enable) {
                groups.push(groupNodeGen(profile.name, profile.type, profile.reg))
            }
        })
        return groups
    }

    function groupDefaultProcessor() {
        let groups = []
        profiles.forEach((profile) => {
            if (profile.proType === "default" && profile.enable) {
                groups.push(nodeStructGen(profile.name, profile.type, profile.proxy, profile.url, profile.interval))

            }
        })
        return groups
    }

    function groupCustomProcessor() {
        let groups = []
        profiles.forEach((profile) => {
            if (profile.proType === "custom" && profile.enable) {
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
            if (profile.proType === "rule" ) {
                if (profile.type!=="MATCH"){
                    rules.push(profile.type+","+profile.rule)
                }else {
                    rules.push(profile.type+","+profile.name+","+profile.rule)
                }
            }
        })
        return rules
    }
    function ruleProviderProcessor() {
        let rulesProviders = {}
        profiles.forEach((profile) => {
            if (profile.proType === "rule_provider" ) {
                let ruleProvider = {}
                ruleProvider.type = profile.type
                ruleProvider.behavior = profile.behavior
                ruleProvider.url = profile.url
                ruleProvider.path = "./ruleset/"+profile.name+".yaml"
                ruleProvider.interval = profile.interval
                rulesProviders[profile.name] = ruleProvider
            }
        })

        return rulesProviders
    }

    let rawObj = params
    let groups = []
    let rules = []

    groups.push(...groupProcessor())
    rules.push(...ruleProcessor())
    rawObj["rules"] = rules
    rawObj["proxy-groups"]  = groups
    rawObj["proxy-providers"]  = {}
    rawObj["rule-providers"]  = ruleProviderProcessor()

    return rawObj
}

var data = {
    "port": 7890,
    "socks-port": 7891,
    "redir-port": 7892,
    "allow-lan": false,
    "mode": "Rule",
    "log-level": "silent",
    "external-controller": "0.0.0.0:9090",
    "secret": "",
    "proxies": [{
        "name": "1 备用登录 管人痴.com",
        "type": "ss",
        "server": "1.1.1.1",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "1 备用面板 ssr.wtf",
        "type": "ss",
        "server": "59.43.17.23",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "1 忘记登录需联系客服",
        "type": "ss",
        "server": "59.43.120.67",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "1 此计划禁止工作室使用 禁止任何商业使用",
        "type": "ss",
        "server": "114.152.162.31",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "1 请使用全局代理访问官网，非全局会拦截报1020",
        "type": "ss",
        "server": "116.236.21.7",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "ASYNCHRONOUS TRANSFERMODE 永久虚通路连接PVCC A01",
        "type": "ss",
        "server": "pvcc01.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "ASYNCHRONOUS TRANSFERMODE 永久虚通路连接PVCC A02",
        "type": "ss",
        "server": "pvcc02.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "ASYNCHRONOUS TRANSFERMODE 永久虚通路连接PVCC A03",
        "type": "ss",
        "server": "pvcc03.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "ASYNCHRONOUS TRANSFERMODE 永久虚通路连接PVCC A04",
        "type": "ss",
        "server": "pvcc04.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "ASYNCHRONOUS TRANSFERMODE 永久虚通路连接PVCC A05",
        "type": "ss",
        "server": "pvcc05.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "ASYNCHRONOUS TRANSFERMODE 永久虚通路连接PVCC A06",
        "type": "ss",
        "server": "pvcc06.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "Next generation AnyPath® Direct Internet Zero Trust Network Access (DIZTNA3.0) CloudBlades 1",
        "type": "ss",
        "server": "hkgame01.graniterapids.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "Next generation AnyPath® Direct Internet Zero Trust Network Access (DIZTNA3.0) CloudBlades 2",
        "type": "ss",
        "server": "hkgame02.graniterapids.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "Next generation AnyPath® Direct Internet Zero Trust Network Access (DIZTNA3.0) CloudBlades 3",
        "type": "ss",
        "server": "hkgame03.graniterapids.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "Next generation AnyPath® Direct Internet Zero Trust Network Access (DIZTNA3.0) CloudBlades 4",
        "type": "ss",
        "server": "hkgame04.graniterapids.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "Next generation AnyPath® Direct Internet Zero Trust Network Access (DIZTNA3.0) CloudBlades 5",
        "type": "ss",
        "server": "hkgame05.graniterapids.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "Next generation AnyPath® Direct Internet Zero Trust Network Access (DIZTNA3.0) CloudBlades 6",
        "type": "ss",
        "server": "hkgame06.graniterapids.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-加拿大 IPLC A01",
        "type": "ss",
        "server": "ca01.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-加拿大 IPLC A02",
        "type": "ss",
        "server": "ca02.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-加拿大 IPLC A03",
        "type": "ss",
        "server": "ca03.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-加拿大 IPLC A04",
        "type": "ss",
        "server": "ca04.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-加拿大 IPLC A05",
        "type": "ss",
        "server": "ca05.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-印度 马哈拉施特拉 IPLC A01",
        "type": "ss",
        "server": "in01.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-印度 马哈拉施特拉 IPLC A02",
        "type": "ss",
        "server": "in02.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-印度 马哈拉施特拉 IPLC A03",
        "type": "ss",
        "server": "in03.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-印度 马哈拉施特拉 IPLC A04",
        "type": "ss",
        "server": "in04.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-印度 马哈拉施特拉 IPLC A05",
        "type": "ss",
        "server": "in05.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-印度 马哈拉施特拉 IPLC A06",
        "type": "ss",
        "server": "in06.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-台湾 IEPL HiNet固接 A01 Netflix 动画疯",
        "type": "ss",
        "server": "tw01.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-台湾 IEPL HiNet固接 A02 Netflix 动画疯",
        "type": "ss",
        "server": "tw02.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-台湾 IEPL HiNet固接 A03 Netflix 动画疯",
        "type": "ss",
        "server": "tw03.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-台湾 IEPL HiNet固接 A04 Netflix 动画疯",
        "type": "ss",
        "server": "tw04.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-台湾 IEPL HiNet固接 A05 Netflix 动画疯",
        "type": "ss",
        "server": "tw05.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-台湾 IEPL HiNet固接 A06 Netflix 动画疯",
        "type": "ss",
        "server": "tw06.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-台湾 IEPL HiNet固接 A07 Netflix 动画疯",
        "type": "ss",
        "server": "tw07.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-台湾 IEPL HiNet固接 A08 Netflix 动画疯",
        "type": "ss",
        "server": "tw08.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-台湾 IEPL HiNet固接 A09 Netflix 动画疯",
        "type": "ss",
        "server": "tw09.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-台湾 IEPL HiNet固接 A11 Netflix 动画疯",
        "type": "ss",
        "server": "tw11.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-台湾 IEPL HiNet固接 A12 Netflix 动画疯",
        "type": "ss",
        "server": "tw12.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-台湾 IEPL HiNet固接 A13 Netflix 动画疯",
        "type": "ss",
        "server": "tw13.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-台湾 IEPL HiNet固接 A14 Netflix 动画疯",
        "type": "ss",
        "server": "tw14.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-台湾 IEPL游戏专线 A",
        "type": "ss",
        "server": "twgame01.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-台湾 IEPL游戏专线 B",
        "type": "ss",
        "server": "twgame02.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-台湾 IEPL游戏专线 C",
        "type": "ss",
        "server": "twgame03.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-台湾 IEPL游戏专线 D",
        "type": "ss",
        "server": "twgame04.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-台湾 IEPL游戏专线 E",
        "type": "ss",
        "server": "twgame05.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-台湾 IEPL游戏专线 F",
        "type": "ss",
        "server": "twgame06.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-台湾 IEPL游戏专线 G",
        "type": "ss",
        "server": "twgame07.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-台湾 IPLC 台湾固网 A01 Netflix 动画疯",
        "type": "ss",
        "server": "twct01.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-台湾 IPLC 台湾固网 A02 Netflix 动画疯",
        "type": "ss",
        "server": "twct02.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-台湾 IPLC 台湾固网 A03 Netflix 动画疯",
        "type": "ss",
        "server": "twct03.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-台湾 IPLC 台湾固网 A04 Netflix 动画疯",
        "type": "ss",
        "server": "twct04.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-台湾 IPLC 台湾固网 A05 Netflix 动画疯",
        "type": "ss",
        "server": "twct05.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-台湾 IPLC 台湾固网 A06 Netflix 动画疯",
        "type": "ss",
        "server": "twct06.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-台湾 IPLC 台湾固网 A07 Netflix 动画疯",
        "type": "ss",
        "server": "twct07.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-台湾 IPLC 台湾固网 A08 Netflix 动画疯",
        "type": "ss",
        "server": "twct08.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-台湾 IPLC 台湾固网 A09 Netflix 动画疯",
        "type": "ss",
        "server": "twct09.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-台湾 IPLC 台湾固网 A10 Netflix 动画疯",
        "type": "ss",
        "server": "twct10.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-台湾 IPLC 台湾固网 A11 Netflix 动画疯",
        "type": "ss",
        "server": "twct11.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-台湾 IPLC 台湾固网 A12 Netflix 动画疯",
        "type": "ss",
        "server": "twct12.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-台湾 IPLC 台湾固网 A13 Netflix 动画疯",
        "type": "ss",
        "server": "twct13.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-日本 多协议标签交换虚拟专用网 A1 1000Mbps",
        "type": "ss",
        "server": "hr01.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-日本 多协议标签交换虚拟专用网 A2 1000Mbps",
        "type": "ss",
        "server": "hr02.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-日本 多协议标签交换虚拟专用网 A3 1000Mbps",
        "type": "ss",
        "server": "hr03.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-日本 多协议标签交换虚拟专用网 A4 1000Mbps",
        "type": "ss",
        "server": "hr04.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-日本 多协议标签交换虚拟专用网 A5 1000Mbps",
        "type": "ss",
        "server": "hr05.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-日本 多协议标签交换虚拟专用网 A6 1000Mbps",
        "type": "ss",
        "server": "hr06.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-日本 多协议标签交换虚拟专用网 A7 1000Mbps",
        "type": "ss",
        "server": "hr07.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-日本 多协议标签交换虚拟专用网 A8 1000Mbps",
        "type": "ss",
        "server": "hr08.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-日本 多协议标签交换虚拟专用网 A9 1000Mbps",
        "type": "ss",
        "server": "hr09.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-日本 沪日IEPL传输 Equinix-TY8 A01 Netflix",
        "type": "ss",
        "server": "jp01.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-日本 沪日IEPL传输 Equinix-TY8 A02 Netflix",
        "type": "ss",
        "server": "jp02.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-日本 沪日IEPL传输 Equinix-TY8 A03 Netflix",
        "type": "ss",
        "server": "jp03.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-日本 沪日IEPL传输 Equinix-TY8 A04 Netflix",
        "type": "ss",
        "server": "jp04.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-日本 沪日IEPL传输 Equinix-TY8 A05 Netflix",
        "type": "ss",
        "server": "jp05.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-日本 沪日IEPL传输 Equinix-TY8 A06 Netflix",
        "type": "ss",
        "server": "jp06.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-日本 沪日IEPL传输 Equinix-TY8 A07 Netflix",
        "type": "ss",
        "server": "jp07.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-日本 沪日IEPL传输 Equinix-TY8 A08 Netflix",
        "type": "ss",
        "server": "jp08.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-日本 沪日IEPL传输 Equinix-TY8 A09 Netflix",
        "type": "ss",
        "server": "jp09.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-日本 沪日IEPL传输 Equinix-TY8 A10 Netflix",
        "type": "ss",
        "server": "jp10.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-法国 IPLC A01",
        "type": "ss",
        "server": "fr01.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-法国 IPLC A02",
        "type": "ss",
        "server": "fr02.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-法国 IPLC A03",
        "type": "ss",
        "server": "fr03.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-法国 IPLC A04",
        "type": "ss",
        "server": "fr04.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-法国 IPLC A05",
        "type": "ss",
        "server": "fr05.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-澳大利亚 IPLC 悉尼 A01",
        "type": "ss",
        "server": "au01.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-澳大利亚 IPLC 悉尼 A02",
        "type": "ss",
        "server": "au02.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-澳大利亚 IPLC 悉尼 A03",
        "type": "ss",
        "server": "au03.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-澳大利亚 IPLC 悉尼 A04",
        "type": "ss",
        "server": "au04.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-澳大利亚 IPLC 悉尼 A05",
        "type": "ss",
        "server": "au05.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-爱尔兰 IPLC A01",
        "type": "ss",
        "server": "ir01.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-爱尔兰 IPLC A02",
        "type": "ss",
        "server": "ir02.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-爱尔兰 IPLC A03",
        "type": "ss",
        "server": "ir03.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-爱尔兰 IPLC A04",
        "type": "ss",
        "server": "ir04.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-爱尔兰 IPLC A05",
        "type": "ss",
        "server": "ir05.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-英国 IPLC BBC A01",
        "type": "ss",
        "server": "uk01.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-英国 IPLC BBC A02",
        "type": "ss",
        "server": "uk02.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-英国 IPLC BBC A03",
        "type": "ss",
        "server": "uk03.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-英国 IPLC BBC A04",
        "type": "ss",
        "server": "uk04.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-荷兰 IPLC A01",
        "type": "ss",
        "server": "ams01.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-荷兰 IPLC A02",
        "type": "ss",
        "server": "ams02.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-韩国 IPLC A01 Netflix",
        "type": "ss",
        "server": "kr01.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-韩国 IPLC A02 Netflix",
        "type": "ss",
        "server": "kr02.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-韩国 IPLC A03 Netflix",
        "type": "ss",
        "server": "kr03.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-韩国 IPLC A04 Netflix",
        "type": "ss",
        "server": "kr04.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-韩国 IPLC A05 Netflix",
        "type": "ss",
        "server": "kr05.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-韩国 IPLC A06 Netflix",
        "type": "ss",
        "server": "kr06.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-韩国 IPLC A07 Netflix",
        "type": "ss",
        "server": "kr07.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-香港 IEPL Equinix HK2 A 01 1Gbps HBO TVB",
        "type": "ss",
        "server": "hk01.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-香港 IEPL Equinix HK2 A 02 1Gbps HBO TVB",
        "type": "ss",
        "server": "hk02.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-香港 IEPL Equinix HK2 A 03 1Gbps HBO TVB",
        "type": "ss",
        "server": "hk03.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-香港 IEPL Equinix HK2 A 04 1Gbps HBO TVB",
        "type": "ss",
        "server": "hk04.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-香港 IEPL Equinix HK2 A 05 1Gbps HBO TVB",
        "type": "ss",
        "server": "hk05.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-香港 IEPL Equinix HK2 A 06 1Gbps HBO TVB",
        "type": "ss",
        "server": "hk06.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-香港 IEPL Equinix HK2 A 07 1Gbps HBO TVB",
        "type": "ss",
        "server": "hk07.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-香港 IEPL Equinix HK2 A 09 1Gbps HBO TVB",
        "type": "ss",
        "server": "hk09.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-香港 IEPL Equinix HK2 A 10 1Gbps HBO TVB",
        "type": "ss",
        "server": "hk10.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-香港 IPLC Equinix HK2 A 02 1Gbps HBO TVB",
        "type": "ss",
        "server": "sg02.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-香港 IPLC Equinix HK2 A 03 1Gbps HBO TVB",
        "type": "ss",
        "server": "sg03.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-香港 IPLC Equinix HK2 A 04 1Gbps HBO TVB",
        "type": "ss",
        "server": "sg04.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-香港 IPLC Equinix HK2 A 05 1Gbps HBO TVB",
        "type": "ss",
        "server": "sg05.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-香港 IPLC Equinix HK2 A 06 1Gbps HBO TVB",
        "type": "ss",
        "server": "sg06.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-香港 IPLC Equinix HK2 A 07 1Gbps HBO TVB",
        "type": "ss",
        "server": "sg07.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-香港 IPLC Equinix HK2 A 08 1Gbps HBO TVB",
        "type": "ss",
        "server": "sg08.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-香港 IPLC Equinix HK2 A 09 1Gbps HBO TVB",
        "type": "ss",
        "server": "sg09.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-香港 IPLC Equinix HK2 A 10 1Gbps HBO TVB",
        "type": "ss",
        "server": "sg10.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-香港 IPLC Equinix HK2 A 11 1Gbps HBO TVB",
        "type": "ss",
        "server": "sg11.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-香港 IPLC Equinix HK2 A 12 1Gbps HBO TVB",
        "type": "ss",
        "server": "sg12.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-香港 IPLC Equinix HK2 A 13 1Gbps HBO TVB",
        "type": "ss",
        "server": "sg13.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-香港 IPLC Equinix HK2 A 14 1Gbps HBO TVB",
        "type": "ss",
        "server": "sg14.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-香港 IPLC Equinix HK2 A 15 1Gbps HBO TVB",
        "type": "ss",
        "server": "sg15.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-香港 IPLC Equinix HK2 A 16 1Gbps HBO TVB",
        "type": "ss",
        "server": "sg16.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-香港 IPLC Equinix HK2 A 17 1Gbps HBO TVB",
        "type": "ss",
        "server": "sg17.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-香港 IPLC Equinix HK2 A 18 1Gbps HBO TVB",
        "type": "ss",
        "server": "sg18.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-香港 IPLC Equinix HK2 A 19 1Gbps HBO TVB",
        "type": "ss",
        "server": "sg19.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "中国-香港 IPLC Equinix HK2 A 20 1Gbps HBO TVB",
        "type": "ss",
        "server": "sg20.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "俄罗斯 01",
        "type": "ss",
        "server": "ru01.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "俄罗斯 02",
        "type": "ss",
        "server": "ru02.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "俄罗斯 03",
        "type": "ss",
        "server": "ru03.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "俄罗斯 04",
        "type": "ss",
        "server": "ru04.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "俄罗斯 05",
        "type": "ss",
        "server": "ru05.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "俄罗斯 06",
        "type": "ss",
        "server": "ru06.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "因V2ray重大漏洞问题，暂时下架全部V2节点。请使用ssr/ss连接方式进行使用。",
        "type": "vmess",
        "server": "v2-jp01.ptrecord.com",
        "port": 681,
        "uuid": "fef201ce-00c8-3b28-a76d-fb63729098af",
        "alterId": 1,
        "cipher": "auto",
        "udp": true
    }, {
        "name": "德国 H1",
        "type": "ss",
        "server": "ge01.edg.wtf",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "德国 H2",
        "type": "ss",
        "server": "ge02.edg.wtf",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "德国 H3",
        "type": "ss",
        "server": "ge03.edg.wtf",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "德国 H4",
        "type": "ss",
        "server": "ge04.edg.wtf",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "德国 H5",
        "type": "ss",
        "server": "ge05.edg.wtf",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "德国 H6",
        "type": "ss",
        "server": "ge06.edg.wtf",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "新加坡 Legacy Magic IEPL 中继 A01 Netflix",
        "type": "ss",
        "server": "sgp01.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "新加坡 Legacy Magic IEPL 中继 A02 Netflix",
        "type": "ss",
        "server": "sgp02.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "新加坡 Legacy Magic IEPL 中继 A03 Netflix",
        "type": "ss",
        "server": "sgp03.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "新加坡 Legacy Magic IEPL 中继 A04 Netflix",
        "type": "ss",
        "server": "sgp04.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "新加坡 Legacy Magic IEPL 中继 A05 Netflix",
        "type": "ss",
        "server": "sgp05.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "新加坡 Magic IEPL 中继 A01 Netflix",
        "type": "ss",
        "server": "sgp06.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "新加坡 Magic IEPL 中继 A02 Netflix",
        "type": "ss",
        "server": "sgp07.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "新加坡 Magic IEPL 中继 A03  Netflix",
        "type": "ss",
        "server": "sgp08.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "新加坡 Magic IEPL 中继 A04 Netflix",
        "type": "ss",
        "server": "sgp09.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "新加坡 Magic IEPL 中继 A05  Netflix",
        "type": "ss",
        "server": "sgp10.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "新加坡高级 IEPL 中继 A01 Netflix",
        "type": "ss",
        "server": "sgp11.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "新加坡高级 IEPL 中继 A02  Netflix",
        "type": "ss",
        "server": "sgp12.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "新加坡高级 IEPL 中继 A03 Netflix",
        "type": "ss",
        "server": "sgp13.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "新加坡高级 IEPL 中继 A04 Netflix",
        "type": "ss",
        "server": "sgp14.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "新加坡高级 IEPL 中继 A05  Netflix",
        "type": "ss",
        "server": "sgp15.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "无Ins购买渠道 Ins购买均为二手倒卖",
        "type": "ss",
        "server": "127.0.0.8",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "无QQ购买渠道 QQ购买均为二手倒卖",
        "type": "ss",
        "server": "127.0.0.7",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "无微信购买渠道 微信均为二手倒卖",
        "type": "ss",
        "server": "127.0.0.6",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "日本 ソフトバンク A01 500Mbps 1倍 Netflix",
        "type": "ss",
        "server": "jp13.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "日本 ソフトバンク A02 500Mbps 1倍 Netflix",
        "type": "ss",
        "server": "jp14.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "日本 ソフトバンク A03 500Mbps 1倍 Netflix",
        "type": "ss",
        "server": "jp15.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "日本 ソフトバンク A04 500Mbps 1倍 Netflix",
        "type": "ss",
        "server": "jp16.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "日本 ソフトバンク A05 500Mbps 1倍 Netflix",
        "type": "ss",
        "server": "jp17.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "日本 まつやまし auひかり ホーム1ギガ A 01",
        "type": "ss",
        "server": "jpid01.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "日本 まつやまし auひかり ホーム1ギガ A 02",
        "type": "ss",
        "server": "jpid02.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "日本 まつやまし auひかり ホーム1ギガ A 03",
        "type": "ss",
        "server": "jpid03.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "日本 まつやまし auひかり ホーム1ギガ A 04",
        "type": "ss",
        "server": "jpid04.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "日本 まつやまし auひかり ホーム1ギガ A 05",
        "type": "ss",
        "server": "jpid05.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "日本 まつやまし auひかり ホーム1ギガ A 06",
        "type": "ss",
        "server": "jpid06.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "日本 まつやまし auひかり ホーム1ギガ A 07",
        "type": "ss",
        "server": "jpid07.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "日本 まつやまし auひかり ホーム1ギガ A 08",
        "type": "ss",
        "server": "jpid08.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "日本日本大阪 オプテージ A 01",
        "type": "ss",
        "server": "jpaz01.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "日本日本大阪 オプテージ A 02",
        "type": "ss",
        "server": "jpaz02.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "日本日本大阪 オプテージ A 03",
        "type": "ss",
        "server": "jpaz03.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "日本日本大阪 オプテージ A 04",
        "type": "ss",
        "server": "jpaz04.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "日本日本大阪 オプテージ A 05",
        "type": "ss",
        "server": "jpaz05.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "日本日本大阪 オプテージ A 06",
        "type": "ss",
        "server": "jpaz06.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "日本日本大阪 オプテージ A 07",
        "type": "ss",
        "server": "jpaz07.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "日本日本大阪 オプテージ A 08",
        "type": "ss",
        "server": "jpaz08.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "日本日本大阪 オプテージ A 09",
        "type": "ss",
        "server": "jpaz09.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "游戏 中国-韩国 IEPL 1 3Gbps",
        "type": "ss",
        "server": "kraz01.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "游戏 中国-韩国 IEPL 2 3Gbps",
        "type": "ss",
        "server": "kraz02.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "游戏 中国-韩国 IEPL 3 3Gbps",
        "type": "ss",
        "server": "kraz03.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "游戏 中国-韩国 IEPL 4 3Gbps",
        "type": "ss",
        "server": "kraz04.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "游戏 中国-韩国 IEPL 5 3Gbps",
        "type": "ss",
        "server": "kraz05.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "游戏 中国-韩国 IEPL 6 3Gbps",
        "type": "ss",
        "server": "kraz06.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "游戏 中国-韩国 IEPL 7 3Gbps",
        "type": "ss",
        "server": "kraz07.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "纯IPV6接入",
        "type": "ss",
        "server": "2001:e42:102:1523:160:16:95:158",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "美国实验性 IEPL 中继 A01",
        "type": "ss",
        "server": "us06.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "美国实验性 IEPL 中继 A02",
        "type": "ss",
        "server": "us07.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "美国实验性 IEPL 中继 A03",
        "type": "ss",
        "server": "us08.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "美国实验性 IEPL 中继 A04",
        "type": "ss",
        "server": "us09.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "美国实验性 IEPL 中继 A05",
        "type": "ss",
        "server": "us10.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "美国高级 IEPL 中继 A01",
        "type": "ss",
        "server": "us01.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "美国高级 IEPL 中继 A02",
        "type": "ss",
        "server": "us02.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "美国高级 IEPL 中继 A03",
        "type": "ss",
        "server": "us03.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "美国高级 IEPL 中继 A04",
        "type": "ss",
        "server": "us04.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "美国高级 IEPL 中继 A05",
        "type": "ss",
        "server": "us05.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "集客VPLS/5000Mbps/5000Mbps/上海-(国际)香港 A01",
        "type": "ss",
        "server": "hkaia01.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "韩国 SK 전라북도 전주시 商宽 10Gbps Netflix",
        "type": "ss",
        "server": "krsk01.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "韩国 京畿道板桥 原生游戏解锁 A 01",
        "type": "ss",
        "server": "kr08.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "韩国 京畿道板桥 原生游戏解锁 A 02",
        "type": "ss",
        "server": "kr09.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "韩国 京畿道板桥 原生游戏解锁 A 03",
        "type": "ss",
        "server": "kr10.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "韩国 京畿道板桥 原生游戏解锁 A 04",
        "type": "ss",
        "server": "kr11.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "韩国 京畿道板桥 原生游戏解锁 A 05",
        "type": "ss",
        "server": "kr12.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "韩国 전라북도 전주시 商宽 A 01",
        "type": "ss",
        "server": "krgame01.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "韩国 전라북도 전주시 商宽 A 02",
        "type": "ss",
        "server": "krgame02.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "韩国 전라북도 전주시 商宽 A 03",
        "type": "ss",
        "server": "krgame03.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "韩国 전라북도 전주시 商宽 A 04",
        "type": "ss",
        "server": "krgame04.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "韩国 전라북도 전주시 商宽 A 05",
        "type": "ss",
        "server": "krgame05.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "韩国 전라북도 전주시 商宽 A 06",
        "type": "ss",
        "server": "krgame06.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "香港 油尖旺御金·国峯 名氣通電訊 A01",
        "type": "ss",
        "server": "sg21.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "香港 油尖旺御金·国峯 名氣通電訊 A02",
        "type": "ss",
        "server": "sg22.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "香港 油尖旺御金·国峯 名氣通電訊 A03",
        "type": "ss",
        "server": "sg23.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "香港 油尖旺御金·国峯 名氣通電訊 A04",
        "type": "ss",
        "server": "sg24.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "香港 油尖旺御金·国峯 名氣通電訊 A05",
        "type": "ss",
        "server": "sg25.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "香港 油尖旺御金·国峯 名氣通電訊 A06",
        "type": "ss",
        "server": "sg26.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "香港 油尖旺御金·国峯 名氣通電訊 A07",
        "type": "ss",
        "server": "sg27.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "香港 油尖旺御金·国峯 名氣通電訊 A08",
        "type": "ss",
        "server": "sg28.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "香港 油尖旺御金·国峯 名氣通電訊 A09",
        "type": "ss",
        "server": "sg29.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "香港 油尖旺御金·国峯 名氣通電訊 A10",
        "type": "ss",
        "server": "sg30.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "香港 油尖旺御金·国峯 環球全域電訊 A01",
        "type": "ss",
        "server": "sghk01.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "香港 油尖旺御金·国峯 環球全域電訊 A02",
        "type": "ss",
        "server": "sghk02.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "香港 油尖旺御金·国峯 環球全域電訊 A03",
        "type": "ss",
        "server": "sghk03.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "香港 油尖旺御金·国峯 環球全域電訊 A05",
        "type": "ss",
        "server": "sghk05.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "香港 油尖旺御金·国峯 環球全域電訊 A06",
        "type": "ss",
        "server": "sghk06.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "香港 油尖旺御金·国峯 環球全域電訊 A07",
        "type": "ss",
        "server": "sghk07.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "香港 油尖旺御金·国峯 環球全域電訊 A08",
        "type": "ss",
        "server": "sghk08.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "香港 油尖旺御金·国峯 環球全域電訊 A09",
        "type": "ss",
        "server": "sghk09.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "香港 油尖旺御金·国峯 環球全域電訊 A11",
        "type": "ss",
        "server": "sghk11.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "香港 油尖旺御金·国峯 環球全域電訊 A12",
        "type": "ss",
        "server": "sghk12.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "香港 油尖旺御金·国峯 環球全域電訊 A13",
        "type": "ss",
        "server": "sghk13.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "香港 油尖旺御金·国峯 環球全域電訊 A14",
        "type": "ss",
        "server": "sghk14.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }, {
        "name": "香港 油尖旺御金·国峯 環球全域電訊 A15",
        "type": "ss",
        "server": "sghk15.ptrecord.com",
        "port": 22021,
        "cipher": "rc4-md5",
        "password": "WIk9dr",
        "udp": true
    }],
    "proxy-groups": [{
        "name": "HK_LB",
        "type": "load-balance",
        "url": "http://www.gstatic.com/generate_204",
        "interval": 60,
        "proxies": ["中国-香港 IPLC Equinix HK2 A 02 1Gbps HBO TVB", "中国-香港 IPLC Equinix HK2 A 03 1Gbps HBO TVB", "中国-香港 IPLC Equinix HK2 A 04 1Gbps HBO TVB", "中国-香港 IPLC Equinix HK2 A 05 1Gbps HBO TVB", "中国-香港 IPLC Equinix HK2 A 06 1Gbps HBO TVB", "中国-香港 IPLC Equinix HK2 A 07 1Gbps HBO TVB", "中国-香港 IPLC Equinix HK2 A 08 1Gbps HBO TVB", "中国-香港 IPLC Equinix HK2 A 09 1Gbps HBO TVB", "中国-香港 IPLC Equinix HK2 A 10 1Gbps HBO TVB", "中国-香港 IPLC Equinix HK2 A 11 1Gbps HBO TVB", "中国-香港 IPLC Equinix HK2 A 12 1Gbps HBO TVB", "中国-香港 IPLC Equinix HK2 A 13 1Gbps HBO TVB", "中国-香港 IPLC Equinix HK2 A 14 1Gbps HBO TVB", "中国-香港 IPLC Equinix HK2 A 15 1Gbps HBO TVB", "中国-香港 IPLC Equinix HK2 A 16 1Gbps HBO TVB", "中国-香港 IPLC Equinix HK2 A 17 1Gbps HBO TVB", "中国-香港 IPLC Equinix HK2 A 18 1Gbps HBO TVB", "中国-香港 IPLC Equinix HK2 A 19 1Gbps HBO TVB", "中国-香港 IPLC Equinix HK2 A 20 1Gbps HBO TVB"]
    }, {
        "name": "SG_LB",
        "type": "load-balance",
        "url": "http://www.gstatic.com/generate_204",
        "interval": 60,
        "proxies": ["新加坡高级 IEPL 中继 A01 Netflix", "新加坡高级 IEPL 中继 A02  Netflix", "新加坡高级 IEPL 中继 A03 Netflix", "新加坡高级 IEPL 中继 A04 Netflix", "新加坡高级 IEPL 中继 A05  Netflix"]
    }, {
        "name": "US_LB",
        "type": "load-balance",
        "url": "http://www.gstatic.com/generate_204",
        "interval": 60,
        "proxies": ["美国实验性 IEPL 中继 A01", "美国实验性 IEPL 中继 A02", "美国实验性 IEPL 中继 A03", "美国实验性 IEPL 中继 A04", "美国实验性 IEPL 中继 A05", "美国高级 IEPL 中继 A01", "美国高级 IEPL 中继 A02", "美国高级 IEPL 中继 A03", "美国高级 IEPL 中继 A04", "美国高级 IEPL 中继 A05"]
    }, {
        "name": "JP_LB",
        "type": "load-balance",
        "url": "http://www.gstatic.com/generate_204",
        "interval": 60,
        "proxies": ["日本 ソフトバンク A01 500Mbps 1倍 Netflix", "日本 ソフトバンク A02 500Mbps 1倍 Netflix", "日本 ソフトバンク A03 500Mbps 1倍 Netflix", "日本 ソフトバンク A04 500Mbps 1倍 Netflix", "日本 ソフトバンク A05 500Mbps 1倍 Netflix"]
    }, {
        "name": "KR_LB",
        "type": "load-balance",
        "url": "http://www.gstatic.com/generate_204",
        "interval": 60,
        "proxies": ["游戏 中国-韩国 IEPL 1 3Gbps", "游戏 中国-韩国 IEPL 2 3Gbps", "游戏 中国-韩国 IEPL 3 3Gbps", "游戏 中国-韩国 IEPL 4 3Gbps", "游戏 中国-韩国 IEPL 5 3Gbps", "游戏 中国-韩国 IEPL 6 3Gbps", "游戏 中国-韩国 IEPL 7 3Gbps", "韩国 京畿道板桥 原生游戏解锁 A 01", "韩国 京畿道板桥 原生游戏解锁 A 02", "韩国 京畿道板桥 原生游戏解锁 A 03", "韩国 京畿道板桥 原生游戏解锁 A 04", "韩国 京畿道板桥 原生游戏解锁 A 05"]
    }, {
        "name": "TW_LB",
        "type": "load-balance",
        "url": "http://www.gstatic.com/generate_204",
        "interval": 60,
        "proxies": ["中国-台湾 IEPL游戏专线 A", "中国-台湾 IEPL游戏专线 B", "中国-台湾 IEPL游戏专线 C", "中国-台湾 IEPL游戏专线 D", "中国-台湾 IEPL游戏专线 E", "中国-台湾 IEPL游戏专线 F", "中国-台湾 IEPL游戏专线 G"]
    }, {
        "name": "PROXY",
        "type": "select",
        "proxies": ["HK_LB", "SG_LB", "US_LB", "JP_LB", "KR_LB", "TW_LB"]
    }, {
        "name": "AD Block",
        "type": "fallback",
        "url": "http://www.gstatic.com/generate_204",
        "interval": 86400000,
        "proxies": ["REJECT"]
    }, {
        "name": "Black List (GFWlist)",
        "type": "fallback",
        "url": "http://www.gstatic.com/generate_204",
        "interval": 86400000,
        "proxies": ["DIRECT"]
    }, {
        "name": "White List (Avoid Mainland)",
        "type": "fallback",
        "url": "http://www.gstatic.com/generate_204",
        "interval": 60,
        "proxies": ["PROXY"]
    }, {
        "name": "Proxy Strategy",
        "type": "select",
        "proxies": ["Black List (GFWlist)", "White List (Avoid Mainland)"]
    }, {
        "name": "Social Media",
        "type": "select",
        "proxies": ["HK_LB", "SG_LB", "US_LB", "JP_LB", "KR_LB", "TW_LB"]
    }, {"name": "BattleNet", "type": "select", "proxies": ["HK_LB", "KR_LB", "DIRECT"]}],
    "rules": ["RULE-SET,applications,DIRECT", "DOMAIN,clash.razord.top,DIRECT", "DOMAIN,yacd.haishan.me,DIRECT", "DOMAIN-SUFFIX,org.hk,SG_LB", "DOMAIN-SUFFIX,go.kr,DIRECT", "RULE-SET,custom_direct,DIRECT", "DOMAIN-SUFFIX,tiktok.com,Social Media", "RULE-SET,private,DIRECT", "RULE-SET,reject,AD Block", "RULE-SET,icloud,PROXY", "RULE-SET,apple,PROXY", "RULE-SET,google,DIRECT", "RULE-SET,custom_proxy,PROXY", "RULE-SET,ai,SG_LB", "RULE-SET,media,SG_LB", "RULE-SET,battle_net,BattleNet", "RULE-SET,tld-not-cn,PROXY", "RULE-SET,gfw,PROXY", "RULE-SET,greatfire,PROXY", "RULE-SET,telegramcidr,PROXY", "RULE-SET,lancidr,DIRECT", "RULE-SET,cncidr,DIRECT", "GEOIP,LAN,DIRECT", "GEOIP,CN,DIRECT", "RULE-SET,direct,DIRECT", "RULE-SET,proxy,Proxy Strategy", "MATCH,root,Proxy Strategy"],
    "proxy-providers": {},
    "rule-providers": {
        "reject": {
            "type": "http",
            "behavior": "domain",
            "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/reject.txt",
            "path": "./ruleset/reject.yaml",
            "interval": 86400
        },
        "icloud": {
            "type": "http",
            "behavior": "domain",
            "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/icloud.txt",
            "path": "./ruleset/icloud.yaml",
            "interval": 86400
        },
        "apple": {
            "type": "http",
            "behavior": "domain",
            "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/apple.txt",
            "path": "./ruleset/apple.yaml",
            "interval": 86400
        },
        "google": {
            "type": "http",
            "behavior": "domain",
            "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/google.txt",
            "path": "./ruleset/google.yaml",
            "interval": 86400
        },
        "proxy": {
            "type": "http",
            "behavior": "domain",
            "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/proxy.txt",
            "path": "./ruleset/proxy.yaml",
            "interval": 86400
        },
        "direct": {
            "type": "http",
            "behavior": "domain",
            "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/direct.txt",
            "path": "./ruleset/direct.yaml",
            "interval": 86400
        },
        "private": {
            "type": "http",
            "behavior": "domain",
            "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/private.txt",
            "path": "./ruleset/private.yaml",
            "interval": 86400
        },
        "gfw": {
            "type": "http",
            "behavior": "domain",
            "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/gfw.txt",
            "path": "./ruleset/gfw.yaml",
            "interval": 86400
        },
        "greatfire": {
            "type": "http",
            "behavior": "domain",
            "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/greatfire.txt",
            "path": "./ruleset/greatfire.yaml",
            "interval": 86400
        },
        "tld-not-cn": {
            "type": "http",
            "behavior": "domain",
            "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/tld-not-cn.txt",
            "path": "./ruleset/tld-not-cn.yaml",
            "interval": 86400
        },
        "telegramcidr": {
            "type": "http",
            "behavior": "domain",
            "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/telegramcidr.txt",
            "path": "./ruleset/telegramcidr.yaml",
            "interval": 86400
        },
        "cncidr": {
            "type": "http",
            "behavior": "domain",
            "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/cncidr.txt",
            "path": "./ruleset/cncidr.yaml",
            "interval": 86400
        },
        "lancidr": {
            "type": "http",
            "behavior": "domain",
            "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/lancidr.txt",
            "path": "./ruleset/lancidr.yaml",
            "interval": 86400
        },
        "applications": {
            "type": "http",
            "behavior": "domain",
            "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/applications.txt",
            "path": "./ruleset/applications.yaml",
            "interval": 86400
        },
        "custom_direct": {
            "type": "http",
            "behavior": "domain",
            "url": "https://raw.gitmirror.com/Gavinin/science_internet/master/rules/custom_direct.txt",
            "path": "./ruleset/custom_direct.yaml",
            "interval": 86400
        },
        "custom_proxy": {
            "type": "http",
            "behavior": "domain",
            "url": "https://raw.gitmirror.com/Gavinin/science_internet/master/rules/custom_proxy.txt",
            "path": "./ruleset/custom_proxy.yaml",
            "interval": 86400
        },
        "ai": {
            "type": "http",
            "behavior": "domain",
            "url": "https://raw.gitmirror.com/Gavinin/science_internet/master/rules/ai.txt",
            "path": "./ruleset/ai.yaml",
            "interval": 86400
        },
        "media": {
            "type": "http",
            "behavior": "domain",
            "url": "https://raw.gitmirror.com/Gavinin/science_internet/master/rules/media.txt",
            "path": "./ruleset/media.yaml",
            "interval": 86400
        },
        "battle_net": {
            "type": "http",
            "behavior": "domain",
            "url": "https://raw.gitmirror.com/Gavinin/science_internet/master/rules/battle_net.txt",
            "path": "./ruleset/battle_net.yaml",
            "interval": 86400
        }
    }
}
let result = main(data)
console.log(JSON.stringify(result))