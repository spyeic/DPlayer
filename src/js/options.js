/* global DPLAYER_VERSION */
import defaultApiBackend from './api.js';

/**
 * @typedef {import('./player').default} DPlayer
 *
 * @typedef {{
 *     quality?: { name: string, url: string, type: string }[],
 *     defaultQuality?: number,
 *     url?: string,
 *     pic?: string,
 *     thumbnails?: string,
 *     type?: 'auto' | 'hls' | 'flv' | 'dash' | 'webtorrent' | 'normal' | string,
 *     customType?: { [index: string]: (video: Video, player: DPlayer) => void },
 * }} Video
 *
 * @typedef {{
 *     container?: HTMLElement,
 *     element?: HTMLElement,
 *     live?: boolean,
 *     autoplay?: boolean,
 *     theme?: string,
 *     loop?: boolean,
 *     lang?: 'en' | 'zh-cn'| 'zh-tw' | 'ko-kr' | 'de' | 'ja' | 'ru',
 *     screenshot?: boolean,
 *     hotkey?: boolean,
 *     pictureInPicture?: boolean,
 *     airplay?: boolean,
 *     chromecast?: boolean,
 *     preload?: 'none' | 'metadata' | 'auto',
 *     volume?: number,
 *     playbackSpeed?: number[],
 *     logo?: string,
 *     apiBackend?: {
 *         send: (options: { url: string, data: any, success: (data: any) => void, error: (msg: string) => void }) => void,
 *         read: (options: { url: string, success: (data: any) => void, error: (msg: string) => void }) => void,
 *     },
 *     preventClickToggle?: boolean,
 *     video?: Video,
 *     subtitle?: {
 *         url: string,
 *         type?: 'webvtt',
 *         fontSize?: string,
 *         bottom?: string,
 *         color?: string,
 *     }
 *     danmaku?: {
 *         id: string,
 *         api: string,
 *         token?: string,
 *         maximum?: number,
 *         addition?: string[],
 *         user?: string,
 *         bottom?: string,
 *         unlimited?: boolean,
 *         speedRate?: number,
 *     },
 *     contextmenu?: {
 *         text: string,
 *         link?: string,
 *         click?: (player: DPlayer) => void,
 *     }[],
 *     highlight?: {
 *         time: number,
 *         text: string,
 *     }[],
 *     mutex?: boolean,
 * }} DPlayerOptions
 *
 * @param {DPlayerOptions} options
 * @return {DPlayerOptions}
 */
export default (options) => {
    // default options
    const defaultOption = {
        container: options.element || document.getElementsByClassName('dplayer')[0],
        live: false,
        autoplay: false,
        theme: '#b7daff',
        loop: false,
        lang: (navigator.language || navigator.browserLanguage).toLowerCase(),
        screenshot: false,
        pictureInPicture: true,
        airplay: true,
        chromecast: false,
        hotkey: true,
        preload: 'metadata',
        volume: 0.7,
        playbackSpeed: [0.5, 0.75, 1, 1.25, 1.5, 2],
        apiBackend: defaultApiBackend,
        video: {},
        contextmenu: [],
        mutex: true,
        pluginOptions: { hls: {}, flv: {}, dash: {}, webtorrent: {} },
        preventClickToggle: false,
    };
    for (const defaultKey in defaultOption) {
        if (defaultOption.hasOwnProperty(defaultKey) && !options.hasOwnProperty(defaultKey)) {
            options[defaultKey] = defaultOption[defaultKey];
        }
    }
    if (options.video) {
        !options.video.type && (options.video.type = 'auto');
    }
    if (typeof options.danmaku === 'object' && options.danmaku) {
        !options.danmaku.user && (options.danmaku.user = 'DIYgod');
    }
    if (options.subtitle) {
        !options.subtitle.type && (options.subtitle.type = 'webvtt');
        !options.subtitle.fontSize && (options.subtitle.fontSize = '20px');
        !options.subtitle.bottom && (options.subtitle.bottom = '40px');
        !options.subtitle.color && (options.subtitle.color = '#fff');
    }

    if (options.video.quality) {
        options.video.url = options.video.quality[options.video.defaultQuality].url;
    }

    if (options.lang) {
        options.lang = options.lang.toLowerCase();
    }

    options.contextmenu = options.contextmenu.concat([
        {
            key: 'video-info',
            click: (player) => {
                player.infoPanel.triggle();
            },
        },
        {
            key: 'about-author',
            link: 'https://diygod.me',
        },
        {
            text: `DPlayer v${DPLAYER_VERSION}`,
            link: 'https://github.com/MoePlayer/DPlayer',
        },
    ]);

    return options;
};
