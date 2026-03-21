class oe {
  constructor() {
    this.listeners = /* @__PURE__ */ new Map(), this.destroyed = !1;
  }
  /* =========================================
     Subscribe
  ========================================= */
  on(t, i) {
    if (this.destroyed)
      return console.warn("[ChatyPlayer] Cannot subscribe. Player destroyed."), () => {
      };
    if (typeof i != "function")
      throw new Error("[ChatyPlayer] Event handler must be a function.");
    return this.listeners.has(t) || this.listeners.set(t, /* @__PURE__ */ new Set()), this.listeners.get(t).add(i), () => this.off(t, i);
  }
  /* =========================================
     Unsubscribe
  ========================================= */
  off(t, i) {
    if (this.destroyed) return;
    const e = this.listeners.get(t);
    e && (e.delete(i), e.size === 0 && this.listeners.delete(t));
  }
  /* =========================================
     Emit
  ========================================= */
  emit(t, i) {
    if (this.destroyed) return;
    const e = this.listeners.get(t);
    e && e.forEach((r) => {
      try {
        const o = r;
        i !== void 0 ? o(i) : o();
      } catch (o) {
        console.error(
          `[ChatyPlayer] Error in "${String(t)}" handler:`,
          o
        );
      }
    });
  }
  /* =========================================
     Remove All
  ========================================= */
  removeAll() {
    this.listeners.clear();
  }
  /* =========================================
     Destroy
  ========================================= */
  destroy() {
    this.destroyed || (this.removeAll(), this.destroyed = !0);
  }
}
function se(n, t) {
  const i = n.getVideo(), e = (o, s = 0) => {
    const a = Number(o);
    return Number.isFinite(a) ? a : s;
  }, r = (o, ...s) => {
    const y = n[o];
    if (typeof y == "function")
      try {
        y.apply(n, s);
      } catch {
      }
  };
  return {
    async play() {
      try {
        await n.play();
      } catch {
      }
    },
    pause() {
      n.pause();
    },
    seek(o) {
      const s = i.duration || 0, a = Math.min(
        Math.max(0, e(o)),
        s
      );
      n.seek(a);
    },
    setVolume(o) {
      const s = Math.min(
        Math.max(0, e(o)),
        1
      );
      i.volume = s;
    },
    mute() {
      i.muted = !0;
    },
    unmute() {
      i.muted = !1;
    },
    toggleFullscreen() {
      r("toggleFullscreen");
    },
    toggleTheater() {
      r("toggleTheater");
    },
    togglePiP() {
      r("togglePiP");
    },
    setSpeed(o) {
      const s = Math.min(
        Math.max(0.25, e(o)),
        4
      );
      r("setSpeed", s);
    },
    setQuality(o) {
      typeof o == "string" && r("setQuality", o);
    },
    enableSubtitle(o) {
      typeof o == "string" && r("enableSubtitle", o);
    },
    disableSubtitles() {
      r("disableSubtitles");
    },
    captureScreenshot() {
      const s = n.captureScreenshot;
      if (typeof s == "function")
        try {
          const a = s.call(n);
          return typeof a == "string" ? a : null;
        } catch {
          return null;
        }
      return null;
    },
    downloadScreenshot() {
      r("downloadScreenshot");
    },
    getTimestampLink() {
      const s = n.getTimestampLink;
      if (typeof s == "function")
        try {
          const a = s.call(n);
          return typeof a == "string" ? a : null;
        } catch {
          return null;
        }
      return null;
    },
    on(o, s) {
      t && typeof s == "function" && t.on(o, s);
    },
    off(o, s) {
      t && typeof s == "function" && t.off(o, s);
    }
  };
}
function ae(n, t, i, e) {
  const r = n.getVideo(), o = n.getContainer(), s = n.getEvents(), a = document.createElement("div");
  a.className = "chatyplayer-settings-wrapper";
  const y = document.createElement("button");
  y.type = "button", y.className = "chatyplayer-btn chatyplayer-settings-toggle", y.setAttribute("aria-label", "Settings"), y.textContent = "⚙";
  const c = document.createElement("div");
  c.className = "chatyplayer-settings-panel", c.setAttribute("aria-hidden", "true"), a.appendChild(y), a.appendChild(c), t.appendChild(a);
  let p = !1;
  const l = () => {
    p = !p, c.classList.toggle("is-open", p), c.setAttribute("aria-hidden", p ? "false" : "true");
  };
  y.addEventListener("click", l);
  const u = {}, h = (P) => {
    Object.values(u).forEach((V) => {
      V.style.display = "none";
    });
    const k = u[P];
    k && (k.style.display = "block");
  }, g = (P) => {
    const k = document.createElement("div");
    return k.className = "chatyplayer-settings-menu", k.style.display = "none", c.appendChild(k), u[P] = k, k;
  }, f = (P) => {
    const k = document.createElement("button");
    k.className = "chatyplayer-settings-btn", k.textContent = "← Back";
    const V = () => h("main");
    k.addEventListener("click", V), P.appendChild(k);
  }, d = g("main"), m = (P, k) => {
    const V = document.createElement("button");
    V.className = "chatyplayer-settings-btn", V.textContent = `${P} ›`;
    const W = () => h(k);
    V.addEventListener("click", W), d.appendChild(V);
  };
  m("Playback", "playback"), m("Player", "player"), m("View", "view");
  const v = g("playback");
  f(v), s.on("ready", () => {
    var K;
    const P = n.quality;
    if (!(P != null && P.getAvailableQualities)) return;
    const k = P.getAvailableQualities();
    if (!Array.isArray(k) || k.length <= 1) return;
    const V = document.createElement("div"), W = document.createElement("div");
    W.textContent = "Quality";
    const D = document.createElement("select");
    D.className = "chatyplayer-settings-select", k.forEach((z) => {
      const X = document.createElement("option");
      X.value = z, X.textContent = z === "auto" ? "Auto" : z.toUpperCase(), D.appendChild(X);
    });
    const j = (K = P.getCurrentQuality) == null ? void 0 : K.call(P);
    j && (D.value = j);
    const ie = () => {
      var z;
      (z = P.setQuality) == null || z.call(P, D.value);
    };
    D.addEventListener("change", ie), V.appendChild(W), V.appendChild(D), v.appendChild(V);
  });
  const E = document.createElement("div"), b = document.createElement("div");
  b.textContent = "Playback Speed";
  const w = document.createElement("select");
  w.className = "chatyplayer-settings-select", [0.5, 0.75, 1, 1.25, 1.5, 2].forEach((P) => {
    const k = document.createElement("option");
    k.value = String(P), k.textContent = `${P}x`, P === 1 && (k.selected = !0), w.appendChild(k);
  });
  const L = () => {
    const P = parseFloat(w.value);
    !Number.isFinite(P) || P <= 0 || n.setSpeed(P);
  };
  w.addEventListener("change", L), E.appendChild(b), E.appendChild(w), v.appendChild(E);
  const T = document.createElement("button");
  T.className = "chatyplayer-settings-btn", T.textContent = "Toggle Loop";
  const M = () => {
    r.loop = !r.loop;
  };
  T.addEventListener("click", M), v.appendChild(T);
  const I = g("player");
  f(I);
  const x = document.createElement("button");
  x.className = "chatyplayer-settings-btn", x.textContent = "Picture in Picture";
  const N = typeof document != "undefined" && "pictureInPictureEnabled" in document && typeof r.requestPictureInPicture == "function";
  N || (x.disabled = !0);
  const O = async () => {
    var P, k;
    if (N)
      try {
        document.pictureInPictureElement ? (await document.exitPictureInPicture(), (k = e == null ? void 0 : e.set) == null || k.call(e, "pip", !1)) : (await r.requestPictureInPicture(), (P = e == null ? void 0 : e.set) == null || P.call(e, "pip", !0));
      } catch {
      }
  };
  x.addEventListener("click", O), I.appendChild(x);
  const S = g("view");
  f(S);
  const F = document.createElement("button");
  F.className = "chatyplayer-settings-btn", F.textContent = "Theater Mode";
  const A = () => {
    var P;
    (P = n.toggleTheater) == null || P.call(n);
  };
  F.addEventListener("click", A), S.appendChild(F);
  const R = document.createElement("button");
  R.className = "chatyplayer-settings-btn", R.textContent = "Mini Player";
  const _ = () => {
    o.classList.toggle("chatyplayer-mini"), o.classList.contains("chatyplayer-mini");
  };
  R.addEventListener("click", _), S.appendChild(R), h("main");
}
const J = "http://www.w3.org/2000/svg";
function B(n, t) {
  const i = document.createElementNS(J, "svg");
  return i.setAttribute("viewBox", n), i.setAttribute("fill", "currentColor"), i.setAttribute("aria-hidden", "true"), i.setAttribute("width", "20"), i.setAttribute("height", "20"), t.forEach(({ d: e }) => {
    const r = document.createElementNS(J, "path");
    r.setAttribute("d", e), i.appendChild(r);
  }), i;
}
const U = {
  play() {
    return B("0 0 24 24", [
      { d: "M8 5v14l11-7z" }
    ]);
  },
  pause() {
    return B("0 0 24 24", [
      { d: "M6 5h4v14H6z" },
      { d: "M14 5h4v14h-4z" }
    ]);
  },
  volume() {
    return B("0 0 24 24", [
      { d: "M3 9v6h4l5 5V4L7 9H3z" },
      { d: "M16 7c1.66 1.66 1.66 8.34 0 10" }
    ]);
  },
  mute() {
    return B("0 0 24 24", [
      { d: "M3 9v6h4l5 5V4L7 9H3z" },
      { d: "M16 9l4 4M20 9l-4 4" }
    ]);
  },
  fullscreen() {
    return B("0 0 24 24", [
      { d: "M7 14H5v5h5v-2H7v-3z" },
      { d: "M19 14h-2v3h-3v2h5v-5z" },
      { d: "M7 10h3V7h2v5H5V5h2v5z" }
    ]);
  },
  settings() {
    return B("0 0 24 24", [
      {
        d: "M12 8a4 4 0 100 8 4 4 0 000-8zm9.4 4a7.4 7.4 0 01-.1 1l2 1.6-2 3.4-2.4-1a7.6 7.6 0 01-1.7 1l-.4 2.6H9.2l-.4-2.6a7.6 7.6 0 01-1.7-1l-2.4 1-2-3.4 2-1.6a7.4 7.4 0 010-2L2.7 9.4l2-3.4 2.4 1a7.6 7.6 0 011.7-1L9.2 3h5.6l.4 2.6a7.6 7.6 0 011.7 1l2.4-1 2 3.4-2 1.6a7.4 7.4 0 01.1 1z"
      }
    ]);
  },
  pip() {
    return B("0 0 24 24", [
      { d: "M3 5h18v14H3z" },
      { d: "M13 13h8v6h-8z" }
    ]);
  }
};
function ce(n, t, i, e) {
  const r = n.getVideo(), o = n.getContainer(), s = document.createElement("div");
  s.className = "chatyplayer-controls";
  const a = document.createElement("div");
  a.className = "chatyplayer-controls-left";
  const y = document.createElement("div");
  y.className = "chatyplayer-controls-right";
  const c = document.createElement("button");
  c.className = "chatyplayer-btn chatyplayer-play", c.type = "button", c.setAttribute("aria-label", "Play"), c.appendChild(U.play());
  const p = () => {
    r.paused ? n.play().catch(() => {
    }) : n.pause();
  }, l = () => {
    c.innerHTML = "", c.appendChild(U.pause()), c.setAttribute("aria-label", "Pause");
  }, u = () => {
    c.innerHTML = "", c.appendChild(U.play()), c.setAttribute("aria-label", "Play");
  };
  c.addEventListener("click", p), r.addEventListener("play", l), r.addEventListener("pause", u);
  const h = document.createElement("span");
  h.className = "chatyplayer-time-inline", h.textContent = "0:00 / 0:00";
  const g = (S) => {
    if (!Number.isFinite(S) || S < 0) return "0:00";
    const F = Math.floor(S / 60), A = Math.floor(S % 60);
    return `${F}:${A.toString().padStart(2, "0")}`;
  }, f = () => {
    const S = g(r.currentTime), F = g(r.duration);
    h.textContent = `${S} / ${F}`;
  };
  r.addEventListener("timeupdate", f), r.addEventListener("loadedmetadata", f);
  const d = document.createElement("div");
  d.className = "chatyplayer-volume";
  const m = document.createElement("button");
  m.className = "chatyplayer-btn chatyplayer-mute", m.type = "button", m.setAttribute("aria-label", "Mute");
  const v = document.createElement("input");
  v.type = "range", v.min = "0", v.max = "1", v.step = "0.01", v.value = String(r.volume), v.className = "chatyplayer-volume-slider", v.setAttribute("aria-label", "Volume");
  const E = () => {
    m.innerHTML = "", r.muted || r.volume === 0 ? m.appendChild(U.mute()) : m.appendChild(U.volume());
  };
  E();
  const b = () => {
    v.value = String(r.muted ? 0 : r.volume), E();
  }, w = () => {
    r.muted = !r.muted, b();
  }, C = () => {
    const S = parseFloat(v.value);
    Number.isFinite(S) && (n.setVolume(S), r.muted = S === 0, b());
  };
  m.addEventListener("click", w), v.addEventListener("input", C), r.addEventListener("volumechange", b), d.appendChild(m), d.appendChild(v);
  const L = document.createElement("button");
  L.className = "chatyplayer-btn chatyplayer-subtitles", L.type = "button", L.setAttribute("aria-label", "Subtitles"), L.textContent = "CC";
  const T = document.createElement("div");
  T.className = "chatyplayer-subtitle-menu", T.style.display = "none";
  const M = () => {
    T.innerHTML = "";
    const S = r.textTracks, F = document.createElement("button");
    F.textContent = "Off", F.addEventListener("click", () => {
      for (let A = 0; A < S.length; A++) {
        const R = S[A];
        R && (R.mode = "disabled");
      }
      T.style.display = "none";
    }), T.appendChild(F);
    for (let A = 0; A < S.length; A++) {
      const R = S[A];
      if (!R) continue;
      const _ = document.createElement("button");
      _.textContent = R.label || R.language || `Track ${A + 1}`, _.addEventListener("click", () => {
        for (let P = 0; P < S.length; P++) {
          const k = S[P];
          k && (k.mode = "disabled");
        }
        R.mode = "showing", T.style.display = "none";
      }), T.appendChild(_);
    }
  }, I = () => {
    T.style.display === "block" ? T.style.display = "none" : (M(), T.style.display = "block");
  };
  L.addEventListener("click", I), ae(n, y, i, e);
  const x = document.createElement("button");
  x.className = "chatyplayer-btn chatyplayer-fullscreen", x.type = "button", x.setAttribute("aria-label", "Fullscreen"), x.appendChild(U.fullscreen());
  const N = () => {
    var S, F;
    document.fullscreenElement ? (F = document.exitFullscreen) == null || F.call(document).catch(() => {
    }) : (S = o.requestFullscreen) == null || S.call(o).catch(() => {
    });
  }, O = () => {
  };
  x.addEventListener("click", N), document.addEventListener("fullscreenchange", O), a.appendChild(c), a.appendChild(h), y.appendChild(L), y.appendChild(T), y.appendChild(d), y.appendChild(x), s.appendChild(a), s.appendChild(y), t.appendChild(s);
}
function le(n, t, i) {
  n.getVideo();
  const e = n.getConfig(), r = Array.isArray(e.chapters) ? e.chapters : [], o = !!e.thumbnails, s = document.createElement("div");
  s.className = "chatyplayer-tooltip", s.style.position = "absolute", s.style.pointerEvents = "none", s.style.display = "none", t.appendChild(s);
  const a = (l) => {
    if (!Number.isFinite(l) || l < 0)
      return "0:00";
    const u = Math.floor(l / 60), h = Math.floor(l % 60);
    return `${u}:${h.toString().padStart(2, "0")}`;
  }, y = (l, u, h) => Math.min(Math.max(l, u), h), c = (l) => {
    var h;
    if (!r.length) return null;
    let u = null;
    for (const g of r)
      if (l >= g.time)
        u = g;
      else
        break;
    return (h = u == null ? void 0 : u.title) != null ? h : null;
  };
  return (l, u) => {
    if (l === null) {
      s.style.display = "none";
      return;
    }
    if (!Number.isFinite(l)) return;
    const h = a(l);
    if (o) {
      const m = c(l);
      s.textContent = m ? `${h}  ${m}` : h;
    } else
      s.textContent = h;
    const g = t.getBoundingClientRect(), f = s.offsetWidth || 40, d = y(
      (u != null ? u : 0) - f / 2,
      0,
      g.width - f
    );
    s.style.left = `${d}px`, s.style.bottom = "100%", s.style.display = "block";
  };
}
function ue(n, t) {
  const i = n.getConfig();
  if (!i.thumbnails) return null;
  const e = i.thumbnails, {
    src: r,
    width: o,
    height: s,
    columns: a,
    rows: y,
    interval: c
  } = e;
  if (!r || !o || !s || !a || !y || !c)
    return console.warn("[ChatyPlayer] Invalid thumbnail configuration."), null;
  const p = document.createElement("div");
  p.className = "chatyplayer-thumbnail", p.style.backgroundImage = `url("${r}")`, p.style.backgroundRepeat = "no-repeat", p.style.width = `${o}px`, p.style.height = `${s}px`, p.style.display = "none", t.appendChild(p);
  const l = a * y, u = (g, f) => {
    if (!Number.isFinite(g)) return;
    const d = Math.floor(g / c), m = Math.min(d, l - 1), v = m % a, E = Math.floor(m / a), b = -(v * o), w = -(E * s);
    p.style.backgroundPosition = `${b}px ${w}px`, p.style.left = `${f}px`, p.style.display = "block";
  }, h = () => {
    p.style.display = "none";
  };
  return t.addEventListener("mouseleave", h), u;
}
function de(n, t, i, e) {
  const r = n.getVideo(), o = document.createElement("div");
  o.className = "chatyplayer-timeline";
  const s = document.createElement("div");
  s.className = "chatyplayer-progress-wrapper";
  const a = document.createElement("div");
  a.className = "chatyplayer-buffer";
  const y = document.createElement("div");
  y.className = "chatyplayer-progress";
  const c = document.createElement("input");
  c.type = "range", c.min = "0", c.max = "100", c.step = "0.1", c.value = "0", c.className = "chatyplayer-seek", c.setAttribute("aria-label", "Seek"), s.appendChild(a), s.appendChild(y), s.appendChild(c), o.appendChild(s), t.appendChild(o);
  const p = le(n, s), l = ue(n, s);
  let u = !1;
  const h = () => {
    const L = r.duration;
    if (!Number.isFinite(L) || L <= 0) return;
    const M = r.currentTime / L * 100;
    y.style.width = `${M}%`, u || (c.value = String(M));
  }, g = () => {
    const L = r.duration;
    if (!(!Number.isFinite(L) || L <= 0 || r.buffered.length === 0))
      try {
        const M = r.buffered.end(r.buffered.length - 1) / L * 100;
        a.style.width = `${M}%`;
      } catch {
      }
  }, f = () => {
    const L = r.duration;
    if (!Number.isFinite(L) || L <= 0) return;
    const T = parseFloat(c.value);
    if (!Number.isFinite(T)) return;
    const M = !r.paused, I = T / 100 * L;
    n.seek(I), M && n.play().catch(() => {
    });
  }, d = () => {
    u = !0;
  }, m = () => {
    u = !1;
  }, v = (L) => {
    const T = s.getBoundingClientRect();
    if (!T.width) return;
    const M = L.clientX - T.left, I = Math.min(
      Math.max(M / T.width, 0),
      1
    ), x = r.duration || 0;
    if (x <= 0) return;
    const N = I * x;
    p(N, M), l && l(N, M);
  }, E = () => {
    p(null);
  };
  s.addEventListener("mousemove", v), s.addEventListener("mouseleave", E), c.addEventListener("input", f), c.addEventListener("mousedown", d), c.addEventListener("touchstart", d), c.addEventListener("mouseup", m), c.addEventListener("touchend", m), c.addEventListener("click", (L) => {
    L.stopPropagation();
  });
  const b = () => {
    h(), g();
  }, w = () => {
    h();
  }, C = () => {
    g();
  };
  r.addEventListener("loadedmetadata", b), r.addEventListener("timeupdate", w), r.addEventListener("progress", C);
}
function he(n, t, i) {
  var w;
  const e = n.getContainer();
  if (typeof window == "undefined" || !("IntersectionObserver" in window))
    return;
  let r = !1, o = !1;
  const s = document.createElement("div");
  s.style.height = "1px", (w = e.parentElement) == null || w.insertBefore(s, e);
  const a = () => {
    r || (e.classList.add("chatyplayer-mini"), e.style.cursor = "grab", e.style.touchAction = "none", r = !0);
  }, y = () => {
    r && (e.classList.remove("chatyplayer-mini"), e.style.left = "", e.style.top = "", e.style.right = "", e.style.bottom = "", e.style.cursor = "", r = !1);
  };
  new IntersectionObserver(
    (C) => {
      for (const L of C) {
        if (o) return;
        !L.isIntersecting && !r && (o = !0, a(), setTimeout(() => {
          o = !1;
        }, 150)), L.isIntersecting && r && (o = !0, y(), setTimeout(() => {
          o = !1;
        }, 150));
      }
    },
    {
      root: null,
      rootMargin: "0px 0px -100px 0px",
      threshold: 0.3
    }
  ).observe(s);
  let p = !1, l = !1, u = 0, h = 0, g = null;
  const f = 5, d = (C) => {
    if (!r) return;
    g = C.pointerId;
    const L = e.getBoundingClientRect();
    u = C.clientX - L.left, h = C.clientY - L.top, e.style.right = "auto", e.style.bottom = "auto";
    try {
      e.setPointerCapture(C.pointerId);
    } catch {
    }
    p = !0, l = !1, e.style.cursor = "grabbing";
  }, m = (C) => {
    if (!p || C.pointerId !== g) return;
    const L = C.clientX - u, T = C.clientY - h, M = window.innerWidth - e.offsetWidth, I = window.innerHeight - e.offsetHeight, x = Math.max(0, Math.min(L, M)), N = Math.max(0, Math.min(T, I));
    if (!l) {
      const O = Math.abs(C.movementX), S = Math.abs(C.movementY);
      (O > f || S > f) && (l = !0);
    }
    e.style.left = `${x}px`, e.style.top = `${N}px`;
  }, v = (C) => {
    if (!(!p || C.pointerId !== g)) {
      p = !1, g = null;
      try {
        e.releasePointerCapture(C.pointerId);
      } catch {
      }
      e.style.cursor = "grab", E();
    }
  }, E = () => {
    const C = e.getBoundingClientRect(), L = window.innerWidth, T = window.innerHeight, M = C.left + C.width / 2, I = C.top + C.height / 2, x = M < L / 2, N = I < T / 2;
    e.style.left = "", e.style.right = "", e.style.top = "", e.style.bottom = "", x && N ? (e.style.left = "20px", e.style.top = "20px") : !x && N ? (e.style.right = "20px", e.style.top = "20px") : x && !N ? (e.style.left = "20px", e.style.bottom = "20px") : (e.style.right = "20px", e.style.bottom = "20px");
  }, b = () => {
    !r || l || (y(), setTimeout(() => {
      e.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }, 50));
  };
  e.addEventListener("pointerdown", d), window.addEventListener("pointermove", m), window.addEventListener("pointerup", v), e.addEventListener("click", b);
}
const me = ["http:", "https:", "blob:", ""];
function pe(n) {
  if (typeof n != "string" || !n.trim()) return !1;
  try {
    const t = new URL(n, window.location.href);
    return !(!me.includes(t.protocol) || t.protocol === "javascript:" || t.protocol === "data:");
  } catch {
    return !1;
  }
}
function fe(n) {
  switch (n) {
    case "mp4":
      return "video/mp4";
    case "webm":
      return "video/webm";
    case "ogg":
      return "video/ogg";
    default:
      return "";
  }
}
function ye(n) {
  if (typeof document == "undefined") return !1;
  const t = document.createElement("video"), i = fe(n);
  if (!i) return !1;
  const e = t.canPlayType(i);
  return e === "probably" || e === "maybe";
}
function ge(n) {
  const t = [];
  return ["mp4", "webm", "ogg"].forEach((i) => {
    const e = n[i];
    e && pe(e) && ye(i) && t.push(i);
  }), t;
}
function ve(n) {
  const t = ge(n);
  if (t.length === 0) return null;
  const i = ["mp4", "webm", "ogg"];
  for (const e of i)
    if (t.includes(e))
      return {
        format: e,
        src: n[e]
      };
  return null;
}
function be(n, t, i, e) {
  const r = n.getContainer(), o = document, s = () => {
    const l = r;
    if (l.requestFullscreen) return l.requestFullscreen();
    if (l.webkitRequestFullscreen) return l.webkitRequestFullscreen();
    if (l.msRequestFullscreen) return l.msRequestFullscreen();
  }, a = () => {
    if (o.exitFullscreen) return o.exitFullscreen();
    if (o.webkitExitFullscreen) return o.webkitExitFullscreen();
    if (o.msExitFullscreen) return o.msExitFullscreen();
  }, y = () => document.fullscreenElement === r || o.webkitFullscreenElement === r || o.msFullscreenElement === r, c = async () => {
    try {
      y() ? await a() : await s();
    } catch {
    }
  }, p = () => {
    const l = y();
    i == null || i.set("fullscreen", l), e == null || e.emit("fullscreenchange", l);
  };
  return document.addEventListener("fullscreenchange", p), document.addEventListener("webkitfullscreenchange", p), document.addEventListener("msfullscreenchange", p), t == null || t.registerCleanup(() => {
    document.removeEventListener("fullscreenchange", p), document.removeEventListener("webkitfullscreenchange", p), document.removeEventListener("msfullscreenchange", p);
  }), {
    toggleFullscreen: c,
    isFullscreen: y
  };
}
const Z = 5, ee = 0.05;
function Ee(n, t, i) {
  const e = n.getContainer(), r = n.getVideo();
  e.hasAttribute("tabindex") || (e.tabIndex = 0);
  let o = !1;
  const s = () => {
    o = !0;
  }, a = () => {
    o = !1;
  }, y = () => {
    e.focus();
  };
  e.addEventListener("mouseenter", s), e.addEventListener("mouseleave", a), e.addEventListener("click", y);
  const c = () => {
    const l = document.activeElement;
    if (!l) return !1;
    const u = l.tagName.toLowerCase();
    return u === "input" || u === "textarea" || l.isContentEditable ? !1 : l === e || o;
  }, p = (l) => {
    var u, h;
    if (console.log("KEY PRESSED:", l.key), !(!c() && l.key.toLowerCase() !== "t") && !(l.repeat && (l.key === " " || l.key === "m" || l.key === "f" || l.key === "t")))
      switch (l.key.toLowerCase()) {
        case " ":
        case "k":
          l.preventDefault(), r.paused ? n.play().catch(() => {
          }) : n.pause();
          break;
        case "arrowleft":
        case "j":
          l.preventDefault(), n.seek(Math.max(0, r.currentTime - Z));
          break;
        case "arrowright":
        case "l":
          l.preventDefault(), n.seek(r.currentTime + Z);
          break;
        case "arrowup":
          l.preventDefault();
          const g = Math.min(1, r.volume + ee);
          n.setVolume(g), r.muted = !1, i == null || i.set("volume", g), i == null || i.set("muted", !1);
          break;
        case "arrowdown":
          l.preventDefault();
          const f = Math.max(0, r.volume - ee);
          n.setVolume(f), r.muted = !1, i == null || i.set("volume", f);
          break;
        case "m":
          l.preventDefault(), r.muted = !r.muted, i == null || i.set("muted", r.muted);
          break;
        case "f":
          l.preventDefault(), document.fullscreenElement ? (h = document.exitFullscreen) == null || h.call(document) : (u = e.requestFullscreen) == null || u.call(e);
          break;
        case "t":
          console.log("T CASE HIT"), l.preventDefault();
          const d = n.toggleTheater;
          console.log("toggle:", d), typeof d == "function" && (console.log("RUNNING TOGGLE"), d());
          break;
      }
  };
  setTimeout(() => {
    document.addEventListener("keydown", p);
  }, 0), t == null || t.registerCleanup(() => {
    e.removeEventListener("mouseenter", s), e.removeEventListener("mouseleave", a), e.removeEventListener("click", y), document.removeEventListener("keydown", p);
  });
}
const we = 5e3, te = 30, Le = 5;
function Ce(n, t, i) {
  const e = n.getVideo();
  let r = null;
  const o = () => {
    const g = e.currentSrc || e.src || "unknown";
    return `chatyplayer_resume_${btoa(g).slice(0, 50)}`;
  }, s = () => {
    if (!(!e.duration || e.duration < te))
      try {
        const g = o();
        localStorage.setItem(g, String(e.currentTime));
      } catch {
      }
  }, a = () => {
    if (!(!e.duration || e.duration < te))
      try {
        const g = o(), f = localStorage.getItem(g);
        if (!f) return;
        const d = parseFloat(f);
        if (!isFinite(d)) return;
        d < e.duration - Le && (e.currentTime = d, i == null || i.set("currentTime", d));
      } catch {
      }
  }, y = () => {
    r === null && (r = window.setInterval(() => {
      s();
    }, we));
  }, c = () => {
    r !== null && (clearInterval(r), r = null);
  }, p = () => y(), l = () => s(), u = () => {
    c();
    try {
      const g = o();
      localStorage.removeItem(g);
    } catch {
    }
  }, h = () => a();
  return e.addEventListener("play", p), e.addEventListener("pause", l), e.addEventListener("ended", u), e.addEventListener("loadedmetadata", h), t == null || t.registerCleanup(() => {
    c(), e.removeEventListener("play", p), e.removeEventListener("pause", l), e.removeEventListener("ended", u), e.removeEventListener("loadedmetadata", h);
  }), {
    restorePosition: a
  };
}
function Te(n, t, i, e) {
  const r = n.getContainer(), o = r.querySelector(
    ".chatyplayer-video-wrapper"
  ), s = "chatyplayer-theater-active", a = {}, y = () => {
    [r, o].filter(Boolean).forEach((f, d) => {
      ["position", "inset", "width", "height", "maxWidth", "margin", "aspectRatio", "zIndex"].forEach((m) => {
        a[`${m}-${d}`] = f.style[m] || "";
      });
    });
  }, c = () => {
    [r, o].filter(Boolean).forEach((f, d) => {
      ["position", "inset", "width", "height", "maxWidth", "margin", "aspectRatio", "zIndex"].forEach((m) => {
        const v = `${m}-${d}`;
        f.style[m] = a[v] || "";
      });
    });
  }, p = () => r.classList.contains(s), l = () => {
    p() || (y(), r.classList.add(s), r.style.position = "fixed", r.style.inset = "0", r.style.width = "100vw", r.style.height = "100vh", r.style.margin = "0", r.style.maxWidth = "none", r.style.zIndex = "9999", o && (o.style.aspectRatio = "auto", o.style.width = "100%", o.style.height = "100%"), document.body.style.overflow = "hidden", i == null || i.set("theater", !0), e == null || e.emit("theaterchange", !0));
  }, u = () => {
    p() && (r.classList.remove(s), c(), document.body.style.overflow = "", i == null || i.set("theater", !1), e == null || e.emit("theaterchange", !1));
  }, h = () => {
    p() ? u() : l();
  };
  return n.toggleTheater = h, t == null || t.registerCleanup(() => {
    u();
  }), {
    enableTheater: l,
    disableTheater: u,
    toggleTheater: h,
    isTheater: p
  };
}
const ne = 300, Q = 10, Pe = 300, ke = 10;
function Se(n, t, i) {
  const e = n.getContainer(), r = n.getVideo();
  let o = 0, s = null, a = 0, y = 0, c = !1;
  const p = (d) => {
    var v, E;
    const m = (E = (v = d.composedPath) == null ? void 0 : v.call(d)) != null ? E : [];
    for (const b of m)
      if (b instanceof HTMLElement && (b.classList.contains("chatyplayer-controls-layer") || b.classList.contains("chatyplayer-timeline-layer") || b.classList.contains("chatyplayer-settings-panel") || b.classList.contains("chatyplayer-subtitle-menu") || b.tagName === "BUTTON" || b.tagName === "INPUT" || b.tagName === "SELECT" || b.tagName === "TEXTAREA"))
        return !0;
    return !1;
  }, l = () => {
    r.paused ? n.play().catch(() => {
    }) : n.pause();
  }, u = (d) => {
    if (p(d)) return;
    const m = e.getBoundingClientRect(), v = d.clientX < m.left + m.width / 2;
    if (s !== null) {
      window.clearTimeout(s), s = null, v ? n.seek(Math.max(0, r.currentTime - Q)) : n.seek(r.currentTime + Q);
      return;
    }
    s = window.setTimeout(() => {
      l(), s = null;
    }, ne);
  }, h = (d) => {
    if (p(d) || d.touches.length !== 1) return;
    const m = d.touches[0];
    m && (a = m.clientY, y = r.volume, c = !1);
  }, g = (d) => {
    if (d.touches.length !== 1) return;
    const m = d.touches[0];
    if (!m) return;
    const v = a - m.clientY;
    if (Math.abs(v) > ke && (c = !0), !c) return;
    const E = v / Pe, b = Math.min(
      1,
      Math.max(0, y + E)
    );
    r.volume = b, i == null || i.set("volume", b);
  }, f = (d) => {
    if (p(d) || c) return;
    const m = Date.now(), v = m - o, E = d.changedTouches[0];
    if (!E) return;
    const b = e.getBoundingClientRect(), w = E.clientX < b.left + b.width / 2;
    v < ne ? w ? n.seek(Math.max(0, r.currentTime - Q)) : n.seek(r.currentTime + Q) : l(), o = m;
  };
  e.style.userSelect = "none", e.addEventListener("click", u), e.addEventListener("touchstart", h, { passive: !0 }), e.addEventListener("touchmove", g, { passive: !0 }), e.addEventListener("touchend", f), t == null || t.registerCleanup(() => {
    s !== null && (window.clearTimeout(s), s = null), e.removeEventListener("click", u), e.removeEventListener("touchstart", h), e.removeEventListener("touchmove", g), e.removeEventListener("touchend", f);
  });
}
function xe(n) {
  if (!n) return null;
  if (/^\d+$/.test(n)) {
    const a = parseInt(n, 10);
    return isFinite(a) ? a : null;
  }
  const t = /(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/, i = n.match(t);
  if (!i) return null;
  const e = parseInt(i[1] || "0", 10), r = parseInt(i[2] || "0", 10), o = parseInt(i[3] || "0", 10), s = e * 3600 + r * 60 + o;
  return isFinite(s) && s >= 0 ? s : null;
}
function Me(n, t) {
  const i = n.getVideo(), e = () => {
    if (typeof window == "undefined") return null;
    const s = new URL(window.location.href), a = s.searchParams.get("t"), y = s.hash.match(/t=([^&]+)/), c = a || (y ? y[1] : null);
    return c ? xe(c) : null;
  }, r = () => {
    const s = e();
    if (s === null || !i.duration) return;
    const a = Math.min(s, i.duration - 1);
    i.currentTime = a;
  }, o = () => {
    if (typeof window == "undefined") return null;
    const s = Math.floor(i.currentTime || 0), a = new URL(window.location.href);
    return a.searchParams.set("t", String(s)), a.toString();
  };
  return i.addEventListener("loadedmetadata", r), t == null || t.registerCleanup(() => {
    i.removeEventListener("loadedmetadata", r);
  }), {
    getTimestampLink: o
  };
}
function Fe(n, t, i, e) {
  if (typeof document == "undefined") return;
  const r = n.getVideo(), o = document;
  let s = !1, a = Date.now();
  const y = () => {
    a = Date.now();
  };
  document.addEventListener("pointerdown", y), document.addEventListener("keydown", y);
  const c = () => "pictureInPictureEnabled" in document && document.pictureInPictureEnabled === !0 && typeof r.requestPictureInPicture == "function", p = () => o.pictureInPictureElement === r, l = async () => {
    if (c() && !p())
      try {
        await r.requestPictureInPicture();
      } catch {
      }
  }, u = async () => {
    if (c() && p())
      try {
        await o.exitPictureInPicture();
      } catch {
      }
  }, h = async () => {
    c() && (p() ? await u() : await l());
  }, g = () => {
    i == null || i.set("pip", !0), e == null || e.emit("pipchange", !0);
  }, f = () => {
    i == null || i.set("pip", !1), e == null || e.emit("pipchange", !1), s = !1;
  };
  r.addEventListener("enterpictureinpicture", g), r.addEventListener("leavepictureinpicture", f);
  const d = async () => {
    if (!c()) return;
    const m = Date.now() - a < 15e3;
    if (document.visibilityState === "hidden" && !r.paused && !p() && m)
      try {
        s = !0, await l();
      } catch {
      }
    if (document.visibilityState === "visible") {
      if (s && p())
        try {
          await u();
        } catch {
        }
      s = !1;
    }
  };
  return document.addEventListener("visibilitychange", d), t == null || t.registerCleanup(() => {
    if (r.removeEventListener("enterpictureinpicture", g), r.removeEventListener("leavepictureinpicture", f), document.removeEventListener("visibilitychange", d), document.removeEventListener("pointerdown", y), document.removeEventListener("keydown", y), p())
      try {
        o.exitPictureInPicture();
      } catch {
      }
  }), {
    isSupported: c,
    isActive: p,
    togglePiP: h,
    enterPiP: l,
    exitPiP: u
  };
}
const Ne = 0.25, Ie = 4;
function Ae(n, t, i, e) {
  const r = n.getVideo(), o = (c) => {
    if (!isFinite(c)) return;
    const p = Math.min(Math.max(c, Ne), Ie);
    r.playbackRate = p, i == null || i.update({
      playing: !r.paused
    }), e == null || e.emit("speedchange", p);
  }, s = () => r.playbackRate, a = () => {
    o(1);
  }, y = () => {
    i == null || i.update({
      playing: !r.paused
    });
  };
  return r.addEventListener("loadedmetadata", y), t == null || t.registerCleanup(() => {
    r.removeEventListener("loadedmetadata", y);
  }), {
    setSpeed: o,
    getSpeed: s,
    resetSpeed: a
  };
}
function Re(n, t, i, e, r) {
  var m, v;
  const o = n.getVideo(), s = Array.isArray(t.sources) ? t.sources : [];
  let a = (v = (m = s[0]) == null ? void 0 : m.label) != null ? v : "auto", y = !0, c = !1;
  const p = () => s.length ? ["auto", ...s.map((E) => E.label)] : [], l = () => a, u = (E) => {
    if (!E || c || o.src.includes(E.src)) return;
    c = !0;
    const b = Number.isFinite(o.currentTime) ? o.currentTime : 0, w = !o.paused;
    o.pause(), o.src = E.src, o.load();
    const C = () => {
      var L;
      try {
        o.currentTime = b;
      } catch {
      }
      w && o.play().catch(() => {
      }), (L = e == null ? void 0 : e.update) == null || L.call(e, {
        playing: w
      }), r == null || r.emit("qualitychange", E.label), o.removeEventListener("loadedmetadata", C), setTimeout(() => {
        c = !1;
      }, 2e3);
    };
    o.addEventListener("loadedmetadata", C);
  }, h = (E) => {
    if (E === "auto") {
      y = !0, a = "auto";
      return;
    }
    const b = s.find((w) => w.label === E);
    b && (y = !1, a = E, u(b));
  }, g = () => {
    if (!y || c || s.length < 2 || !o.buffered.length) return;
    const E = o.buffered.end(o.buffered.length - 1) - o.currentTime;
    E > 15 && f(), E < 3 && d();
  }, f = () => {
    const E = s.findIndex((w) => w.label === a);
    if (E < 0) return;
    const b = s[E + 1];
    b && (a = b.label, u(b));
  }, d = () => {
    const E = s.findIndex((w) => w.label === a);
    if (E <= 0) return;
    const b = s[E - 1];
    b && (a = b.label, u(b));
  };
  return o.addEventListener("timeupdate", g), i == null || i.registerCleanup(() => {
    o.removeEventListener("timeupdate", g);
  }), {
    getAvailableQualities: p,
    getCurrentQuality: l,
    setQuality: h
  };
}
function Ve(n, t, i, e, r) {
  const o = n.getVideo(), s = [], a = Array.isArray(t) ? t.filter((u) => u && typeof u.time == "number" && Number.isFinite(u.time) && u.time >= 0 && typeof u.title == "string").sort((u, h) => u.time - h.time) : [], y = () => {
    const u = o.duration;
    if (!(!Number.isFinite(u) || u <= 0) && a.length)
      for (let h = 0; h < a.length; h++) {
        const g = a[h], f = a[h + 1], d = g.time, m = f ? f.time : u;
        if (d >= u) continue;
        const v = 0.35;
        let E = d / u * 100, b = (m - d) / u * 100;
        h > 0 && (E += v / 2), h < a.length - 1 && (b -= v);
        const w = document.createElement("div");
        w.className = "chatyplayer-chapter-segment", w.style.left = `${E}%`, w.style.width = `${b}%`, w.setAttribute("role", "button"), w.setAttribute("tabindex", "0"), w.setAttribute("aria-label", g.title);
        const C = () => {
          var T;
          n.seek(d), (T = r == null ? void 0 : r.set) == null || T.call(r, "currentTime", d);
        }, L = (T) => {
          (T.key === "Enter" || T.key === " ") && (T.preventDefault(), C());
        };
        w.addEventListener("click", C), w.addEventListener("keydown", L), i.appendChild(w), s.push(w), e == null || e.registerCleanup(() => {
          w.removeEventListener("click", C), w.removeEventListener("keydown", L);
        });
      }
  }, c = () => {
    const u = o.currentTime;
    if (!Number.isFinite(u) || !a.length) return;
    let h = 0;
    for (let g = 0; g < a.length; g++) {
      const f = a[g];
      if (u >= f.time)
        h = g;
      else
        break;
    }
    for (let g = 0; g < s.length; g++) {
      const f = s[g];
      f && (g === h ? f.classList.add("chatyplayer-chapter-active") : f.classList.remove("chatyplayer-chapter-active"));
    }
  }, p = () => {
    y(), c();
  }, l = () => {
    c();
  };
  return o.addEventListener("loadedmetadata", p), o.addEventListener("timeupdate", l), e == null || e.registerCleanup(() => {
    o.removeEventListener("loadedmetadata", p), o.removeEventListener("timeupdate", l);
    for (const u of s)
      u.parentNode === i && i.removeChild(u);
    s.length = 0;
  }), {
    refresh: y
  };
}
function $e(n) {
  try {
    const t = typeof window != "undefined" ? window.location.href : "http://localhost", i = new URL(n, t);
    return ["http:", "https:", "blob:", "data:"].includes(i.protocol) ? i.href : (console.warn("[ChatyPlayer] Blocked unsafe subtitle URL:", i.protocol), null);
  } catch {
    return null;
  }
}
function Be(n, t, i, e, r) {
  const o = n.getVideo(), s = n.getContainer(), a = [], y = () => {
    Array.isArray(t) && t.forEach((f) => {
      const d = $e(f.src);
      if (!d) return;
      const m = document.createElement("track");
      m.kind = "subtitles", m.label = f.label, m.srclang = f.srclang, m.src = d, f.default && (m.default = !0), o.appendChild(m), a.push(m);
    });
  }, c = (f) => {
    const d = o.textTracks;
    for (let m = 0; m < d.length; m++) {
      const v = d[m];
      v && (v.mode = v.language === f ? "showing" : "disabled");
    }
    r == null || r.emit("subtitlechange", f);
  }, p = () => {
    const f = o.textTracks;
    for (let d = 0; d < f.length; d++) {
      const m = f[d];
      m && (m.mode = "disabled");
    }
    r == null || r.emit("subtitlechange", null);
  }, l = () => t.map((f) => f.srclang).filter(Boolean), u = () => {
    const f = s.querySelector(".chatyplayer-controls-layer");
    if (!f) return -1;
    const d = f.offsetHeight || 50;
    return -(Math.ceil(d / 24) + 1);
  }, h = () => {
    const f = !s.classList.contains("hide-ui"), d = o.textTracks, m = f ? u() : -1;
    for (let v = 0; v < d.length; v++) {
      const E = d[v];
      if (!E || E.mode !== "showing") continue;
      const b = E.cues;
      if (b)
        for (let w = 0; w < b.length; w++) {
          const C = b[w];
          C && (C.snapToLines = !0, C.line = m);
        }
    }
  };
  y();
  const g = t.find((f) => f.default);
  return g && c(g.srclang), s.addEventListener("mousemove", h), s.addEventListener("mouseleave", h), o.addEventListener("play", h), o.addEventListener("pause", h), o.addEventListener("timeupdate", h), o.addEventListener("loadedmetadata", h), i == null || i.registerCleanup(() => {
    s.removeEventListener("mousemove", h), s.removeEventListener("mouseleave", h), o.removeEventListener("play", h), o.removeEventListener("pause", h), o.removeEventListener("timeupdate", h), o.removeEventListener("loadedmetadata", h), a.forEach((f) => {
      f.parentNode === o && o.removeChild(f);
    });
  }), {
    enableSubtitle: c,
    disableSubtitles: p,
    getAvailableSubtitles: l
  };
}
function $(n, t) {
  return {
    name: n,
    init(i) {
      if (i)
        try {
          t(i);
        } catch (e) {
          console.error(
            `[ChatyPlayer] Feature "${n}" failed during init.`,
            e
          );
        }
    },
    destroy(i) {
      try {
        const e = i[`destroy${He(n)}`];
        typeof e == "function" && e.call(i);
      } catch (e) {
        console.error(
          `[ChatyPlayer] Feature "${n}" failed during destroy.`,
          e
        );
      }
    }
  };
}
function He(n) {
  return n ? n.charAt(0).toUpperCase() + n.slice(1) : "";
}
const De = [
  /* ----------------------------------------
  Core features
  ---------------------------------------- */
  $("fullscreen", be),
  $("theater", Te),
  $("keyboard", Ee),
  $("resume", Ce),
  /* ----------------------------------------
  Interaction
  ---------------------------------------- */
  $("gestures", Se),
  /* ----------------------------------------
  Utility features
  ---------------------------------------- */
  $("pip", Fe),
  $("speed", Ae),
  $("timestamp", Me),
  /* ----------------------------------------
  Chapters Feature
  ---------------------------------------- */
  $("chapters", (n) => {
    try {
      const t = n.config, i = n.lifecycle, e = n.state, r = t == null ? void 0 : t.chapters;
      if (!Array.isArray(r) || r.length === 0) return;
      const o = n.getContainer().querySelector(".chatyplayer-timeline-layer");
      if (!o) return;
      Ve(
        n,
        r,
        o,
        i,
        e
      );
    } catch (t) {
      console.error(
        "[ChatyPlayer] Chapters feature initialization failed.",
        t
      );
    }
  }),
  /* ----------------------------------------
  Subtitles Feature
  ----------------------------------------
  WebVTT subtitles with language support
  ---------------------------------------- */
  $("subtitles", (n) => {
    try {
      const t = n.config, i = n.lifecycle, e = n.state, r = n.events, o = t == null ? void 0 : t.subtitles;
      if (!Array.isArray(o) || o.length === 0) return;
      Be(
        n,
        o,
        i,
        e,
        r
      );
    } catch (t) {
      console.error(
        "[ChatyPlayer] Subtitles feature initialization failed.",
        t
      );
    }
  }),
  /* ----------------------------------------
  Quality Feature
  ----------------------------------------
  Supports:
  - Auto
  - 480p / 720p / 1080p
  - Mixed formats (mp4/webm/ogg)
  ---------------------------------------- */
  $("quality", (n) => {
    try {
      const t = n.config, i = n.lifecycle, e = n.state, r = n.events;
      if (!t) return;
      const o = Re(
        n,
        t,
        i,
        e,
        r
      );
      o && (n.quality = o);
    } catch (t) {
      console.error(
        "[ChatyPlayer] Quality feature initialization failed.",
        t
      );
    }
  })
];
class ze {
  constructor(t, i) {
    if (this.destroyed = !1, this.activeFeatures = [], typeof window == "undefined")
      throw new Error("[ChatyPlayer] Cannot initialize on server.");
    if (!(t instanceof HTMLElement))
      throw new Error("[ChatyPlayer] Invalid container element.");
    this.container = t, this.config = i, this.events = new oe(), this.video = this.createVideoElement(), this.mount(), this.initCoreEvents(), this.initAutoHide(), this.initFeatures(), this.initMiniPlayer(), this.api = se(this, this.events), this.events.emit("ready");
  }
  /* =========================================
  Video Element Creation
  ========================================= */
  createVideoElement() {
    var e;
    const t = document.createElement("video");
    t.preload = (e = this.config.preload) != null ? e : "metadata", t.playsInline = !0, t.controls = !1, t.crossOrigin = "anonymous", this.config.poster && (t.poster = this.config.poster);
    const i = this.resolveInitialSource();
    if (!i)
      throw new Error("[ChatyPlayer] No supported video source found.");
    return t.src = i.src, this.config.autoplay && (t.autoplay = !0, t.muted = !0), this.config.loop && (t.loop = !0), t;
  }
  /* =========================================
  Resolve Initial Source
  ========================================= */
  resolveInitialSource() {
    const t = ve(this.config);
    if (t) return t;
    if (Array.isArray(this.config.sources) && this.config.sources.length)
      return this.config.sources[0];
  }
  /* =========================================
  Mount Player Structure
  ========================================= */
  mount() {
    this.container.textContent = "", this.container.classList.add("chatyplayer-root");
    const t = document.createElement("div");
    t.className = "chatyplayer-video-wrapper", this.wrapper = t, t.appendChild(this.video), this.timelineLayer = document.createElement("div"), this.timelineLayer.className = "chatyplayer-timeline-layer";
    const i = document.createElement("div");
    i.className = "chatyplayer-controls-layer", t.appendChild(this.timelineLayer), t.appendChild(i), this.container.appendChild(t), de(this, this.timelineLayer), ce(this, i);
  }
  /* =========================================
  Mini Player
  ========================================= */
  initMiniPlayer() {
    try {
      he(this);
    } catch (t) {
      console.warn("[ChatyPlayer] MiniPlayer failed to initialize.", t);
    }
  }
  /* =========================================
  Auto Hide Controls
  ========================================= */
  initAutoHide() {
    const t = () => {
      this.destroyed || (this.container.classList.remove("hide-ui"), this.hideTimeout && window.clearTimeout(this.hideTimeout), this.hideTimeout = window.setTimeout(() => {
        this.video.paused || this.container.classList.add("hide-ui");
      }, 2e3));
    };
    this.wrapper.addEventListener("mousemove", t), this.wrapper.addEventListener("touchstart", t), this.video.addEventListener("pause", () => {
      this.container.classList.remove("hide-ui");
    }), this.video.addEventListener("play", t);
  }
  /* =========================================
  Core Events
  ========================================= */
  initCoreEvents() {
    const t = this.video;
    t.addEventListener("play", () => {
      this.events.emit("play");
    }), t.addEventListener("pause", () => {
      this.events.emit("pause");
    }), t.addEventListener("ended", () => {
      this.events.emit("ended");
    }), t.addEventListener("timeupdate", () => {
      this.events.emit("timeupdate", t.currentTime);
    }), t.addEventListener("loadedmetadata", () => {
      this.events.emit("loadedmetadata", t.duration);
    }), t.addEventListener("error", () => {
      this.events.emit("error");
    });
  }
  /* =========================================
  Feature System
  ========================================= */
  initFeatures() {
    var i;
    if (this.destroyed) return;
    const t = (i = this.config.features) != null ? i : De;
    for (const e of t)
      try {
        e.init(this), this.activeFeatures.push(e);
      } catch (r) {
        console.error(
          `[ChatyPlayer] Feature "${e.name}" failed.`,
          r
        );
      }
  }
  /* =========================================
  Public Controls
  ========================================= */
  async play() {
    try {
      await this.video.play();
    } catch {
    }
  }
  pause() {
    this.video.pause();
  }
  toggle() {
    this.video.paused ? this.play() : this.pause();
  }
  seek(t) {
    if (!Number.isFinite(t)) return;
    const i = this.video.duration || 0, e = Math.max(0, Math.min(t, i));
    this.video.currentTime = e;
  }
  setVolume(t) {
    Number.isFinite(t) && (this.video.volume = Math.max(0, Math.min(t, 1)));
  }
  setSpeed(t) {
    !Number.isFinite(t) || t <= 0 || (this.video.playbackRate = t);
  }
  /* =========================================
  Getters
  ========================================= */
  getVideo() {
    return this.video;
  }
  getContainer() {
    return this.container;
  }
  getTimeline() {
    return this.timelineLayer;
  }
  getConfig() {
    return this.config;
  }
  getEvents() {
    return this.events;
  }
  /* =========================================
  Destroy Lifecycle
  ========================================= */
  destroy() {
    var t;
    if (!this.destroyed) {
      this.pause(), this.hideTimeout && window.clearTimeout(this.hideTimeout);
      for (const i of this.activeFeatures)
        try {
          (t = i.destroy) == null || t.call(i, this);
        } catch {
        }
      this.video.removeAttribute("src"), this.video.load(), this.events.emit("destroy"), this.events.destroy(), this.container.textContent = "", this.container.classList.remove("chatyplayer-root"), this.activeFeatures = [], this.destroyed = !0;
    }
  }
}
const Ue = {
  autoplay: !1,
  loop: !1,
  muted: !1,
  preload: "metadata"
};
function G(n) {
  return n === "true" || n === "1";
}
function q(n) {
  if (!n) return;
  const t = Number(n);
  if (Number.isFinite(t))
    return t;
}
function Oe(n) {
  return n === "none" || n === "auto" ? n : "metadata";
}
function H(n) {
  if (n)
    try {
      const t = typeof window != "undefined" ? window.location.href : "http://localhost", i = new URL(n, t);
      if (!["http:", "https:", "blob:", "data:"].includes(i.protocol)) {
        console.warn(
          "[ChatyPlayer] Blocked unsafe URL protocol:",
          i.protocol
        );
        return;
      }
      return i.href;
    } catch {
      return;
    }
}
function _e(n) {
  if (!n) return;
  const t = /^#([0-9A-Fa-f]{3}){1,2}$/.test(n), i = /^rgba?\((\s*\d+\s*,){2,3}\s*[\d\.]+\s*\)$/.test(n);
  return t || i ? n : void 0;
}
function qe(n) {
  const t = H(n.thumbnails);
  if (!t) return;
  const i = q(n.thumbWidth), e = q(n.thumbHeight), r = q(n.thumbColumns), o = q(n.thumbRows), s = q(n.thumbInterval);
  if (!i || !e || !r || !o || !s) {
    console.warn("[ChatyPlayer] Invalid thumbnail configuration.");
    return;
  }
  return {
    src: t,
    width: i,
    height: e,
    columns: r,
    rows: o,
    interval: s
  };
}
function We(n) {
  if (n.sources)
    try {
      const t = JSON.parse(n.sources);
      if (!Array.isArray(t)) return;
      const i = [];
      for (const e of t) {
        if (!e || typeof e != "object") continue;
        const r = H(e.src);
        if (!r) continue;
        const o = typeof e.label == "string" ? e.label : "";
        if (!o) continue;
        const s = typeof e.type == "string" ? e.type : void 0;
        i.push({ src: r, label: o, type: s });
      }
      return i.length ? i : void 0;
    } catch {
      console.warn("[ChatyPlayer] Invalid sources configuration.");
      return;
    }
}
function Qe(n) {
  if (n.chapters)
    try {
      const t = JSON.parse(n.chapters);
      if (!Array.isArray(t)) return;
      const i = [];
      for (const e of t) {
        if (!e || typeof e != "object") continue;
        const r = typeof e.time == "number" ? e.time : void 0, o = typeof e.title == "string" ? e.title : "";
        r === void 0 || !o || i.push({ time: r, title: o });
      }
      return i.length ? i : void 0;
    } catch {
      console.warn("[ChatyPlayer] Invalid chapters configuration.");
      return;
    }
}
function Ye(n) {
  if (!(n instanceof HTMLElement))
    throw new Error("[ChatyPlayer] Invalid container element.");
  const t = Object.assign({}, n.dataset), i = qe(t), e = We(t), r = Qe(t), o = {
    ...Ue,
    src: H(t.src),
    mp4: H(t.mp4),
    webm: H(t.webm),
    ogg: H(t.ogg),
    sources: e,
    poster: H(t.poster),
    autoplay: G(t.autoplay),
    loop: G(t.loop),
    muted: G(t.muted),
    preload: Oe(t.preload),
    accentColor: _e(t.color),
    thumbnails: i,
    chapters: r
  };
  return !o.src && !o.mp4 && !o.webm && !o.ogg && !o.sources && console.warn("[ChatyPlayer] No valid video source provided."), o;
}
const Xe = "chaty-player", Y = "data-chaty-initialized";
function re(n) {
  try {
    if (!(n instanceof HTMLElement))
      throw new Error("Invalid container element");
    if (n.hasAttribute(Y))
      return null;
    const t = Ye(n), i = new ze(n, t);
    return n.setAttribute(Y, "true"), i;
  } catch (t) {
    return console.error("[ChatyPlayer] Initialization failed:", t), null;
  }
}
function Ge() {
  if (typeof document == "undefined") return;
  document.querySelectorAll(
    `.${Xe}`
  ).forEach((t) => {
    re(t);
  });
}
function je(n) {
  return n instanceof HTMLElement ? (n.hasAttribute(Y) && (n.removeAttribute(Y), n.textContent = ""), re(n)) : (console.error("[ChatyPlayer] Invalid container provided."), null);
}
const Ke = {
  create: je,
  autoInit: Ge,
  version: "1.0.0"
};
function Je() {
  typeof window != "undefined" && (window.ChatyPlayer || (window.ChatyPlayer = Ke));
}
(function() {
  try {
    Je();
  } catch (t) {
    console.error("[ChatyPlayer] Bootstrap error:", t);
  }
})();
export {
  Ke as default
};
