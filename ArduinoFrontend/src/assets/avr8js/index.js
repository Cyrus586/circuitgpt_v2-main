parcelRequire = (function (e, r, t, n) {
  var i,
    o = "function" == typeof parcelRequire && parcelRequire,
    u = "function" == typeof require && require;
  function f(t, n) {
    if (!r[t]) {
      if (!e[t]) {
        var i = "function" == typeof parcelRequire && parcelRequire;
        if (!n && i) return i(t, !0);
        if (o) return o(t, !0);
        if (u && "string" == typeof t) return u(t);
        var c = new Error("Cannot find module '" + t + "'");
        throw ((c.code = "MODULE_NOT_FOUND"), c);
      }
      (p.resolve = function (r) {
        return e[t][1][r] || r;
      }),
        (p.cache = {});
      var l = (r[t] = new f.Module(t));
      e[t][0].call(l.exports, p, l, l.exports, this);
    }
    return r[t].exports;
    function p(e) {
      return f(p.resolve(e));
    }
  }
  (f.isParcelRequire = !0),
    (f.Module = function (e) {
      (this.id = e), (this.bundle = f), (this.exports = {});
    }),
    (f.modules = e),
    (f.cache = r),
    (f.parent = o),
    (f.register = function (r, t) {
      e[r] = [
        function (e, r) {
          r.exports = t;
        },
        {},
      ];
    });
  for (var c = 0; c < t.length; c++)
    try {
      f(t[c]);
    } catch (e) {
      i || (i = e);
    }
  if (t.length) {
    var l = f(t[t.length - 1]);
    "object" == typeof exports && "undefined" != typeof module
      ? (module.exports = l)
      : "function" == typeof define && define.amd
      ? define(function () {
          return l;
        })
      : n && (this[n] = l);
  }
  if (((parcelRequire = f), i)) throw i;
  return f;
})(
  {
    MkOI: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CPU = void 0);
        const t = 256;
        class s {
          constructor(s, e = 8192) {
            (this.progMem = s),
              (this.sramBytes = e),
              (this.data = new Uint8Array(this.sramBytes + t)),
              (this.data16 = new Uint16Array(this.data.buffer)),
              (this.dataView = new DataView(this.data.buffer)),
              (this.progBytes = new Uint8Array(this.progMem.buffer)),
              (this.readHooks = []),
              (this.writeHooks = []),
              (this.pc22Bits = this.progBytes.length > 131072),
              (this.gpioTimerHooks = []),
              (this.pc = 0),
              (this.cycles = 0),
              this.reset();
          }
          reset() {
            this.data.fill(0), (this.SP = this.data.length - 1);
          }
          readData(t) {
            return t >= 32 && this.readHooks[t]
              ? this.readHooks[t](t)
              : this.data[t];
          }
          writeData(t, s) {
            const e = this.writeHooks[t];
            (e && e(s, this.data[t], t)) || (this.data[t] = s);
          }
          get SP() {
            return this.dataView.getUint16(93, !0);
          }
          set SP(t) {
            this.dataView.setUint16(93, t, !0);
          }
          get SREG() {
            return this.data[95];
          }
          get interruptsEnabled() {
            return !!(128 & this.SREG);
          }
        }
        exports.CPU = s;
      },
      {},
    ],
    deE9: [
      function (require, module, exports) {
        "use strict";
        function a(a) {
          return (
            36864 == (65039 & a) ||
            37376 == (65039 & a) ||
            37902 == (65038 & a) ||
            37900 == (65038 & a)
          );
        }
        function t(t) {
          const e = t.progMem[t.pc];
          if (7168 == (64512 & e)) {
            const a = t.data[(496 & e) >> 4],
              d = t.data[(15 & e) | ((512 & e) >> 5)],
              i = a + d + (1 & t.data[95]),
              s = 255 & i;
            t.data[(496 & e) >> 4] = s;
            let c = 192 & t.data[95];
            (c |= s ? 0 : 2),
              (c |= 128 & s ? 4 : 0),
              (c |= (s ^ d) & (a ^ s) & 128 ? 8 : 0),
              (c |= ((c >> 2) & 1) ^ ((c >> 3) & 1) ? 16 : 0),
              (c |= 256 & i ? 1 : 0),
              (c |= 1 & ((a & d) | (d & ~s) | (~s & a)) ? 32 : 0),
              (t.data[95] = c);
          } else if (3072 == (64512 & e)) {
            const a = t.data[(496 & e) >> 4],
              d = t.data[(15 & e) | ((512 & e) >> 5)],
              i = (a + d) & 255;
            t.data[(496 & e) >> 4] = i;
            let s = 192 & t.data[95];
            (s |= i ? 0 : 2),
              (s |= 128 & i ? 4 : 0),
              (s |= (i ^ d) & (i ^ a) & 128 ? 8 : 0),
              (s |= ((s >> 2) & 1) ^ ((s >> 3) & 1) ? 16 : 0),
              (s |= (a + d) & 256 ? 1 : 0),
              (s |= 1 & ((a & d) | (d & ~i) | (~i & a)) ? 32 : 0),
              (t.data[95] = s);
          } else if (38400 == (65280 & e)) {
            const a = 2 * ((48 & e) >> 4) + 24,
              d = t.dataView.getUint16(a, !0),
              i = (d + ((15 & e) | ((192 & e) >> 2))) & 65535;
            t.dataView.setUint16(a, i, !0);
            let s = 224 & t.data[95];
            (s |= i ? 0 : 2),
              (s |= 32768 & i ? 4 : 0),
              (s |= ~d & i & 32768 ? 8 : 0),
              (s |= ((s >> 2) & 1) ^ ((s >> 3) & 1) ? 16 : 0),
              (s |= ~i & d & 32768 ? 1 : 0),
              (t.data[95] = s),
              t.cycles++;
          } else if (8192 == (64512 & e)) {
            const a =
              t.data[(496 & e) >> 4] & t.data[(15 & e) | ((512 & e) >> 5)];
            t.data[(496 & e) >> 4] = a;
            let d = 225 & t.data[95];
            (d |= a ? 0 : 2),
              (d |= 128 & a ? 4 : 0),
              (d |= ((d >> 2) & 1) ^ ((d >> 3) & 1) ? 16 : 0),
              (t.data[95] = d);
          } else if (28672 == (61440 & e)) {
            const a =
              t.data[16 + ((240 & e) >> 4)] & ((15 & e) | ((3840 & e) >> 4));
            t.data[16 + ((240 & e) >> 4)] = a;
            let d = 225 & t.data[95];
            (d |= a ? 0 : 2),
              (d |= 128 & a ? 4 : 0),
              (d |= ((d >> 2) & 1) ^ ((d >> 3) & 1) ? 16 : 0),
              (t.data[95] = d);
          } else if (37893 == (65039 & e)) {
            const a = t.data[(496 & e) >> 4],
              d = (a >>> 1) | (128 & a);
            t.data[(496 & e) >> 4] = d;
            let i = 224 & t.data[95];
            (i |= d ? 0 : 2),
              (i |= 128 & d ? 4 : 0),
              (i |= 1 & a),
              (i |= ((i >> 2) & 1) ^ (1 & i) ? 8 : 0),
              (i |= ((i >> 2) & 1) ^ ((i >> 3) & 1) ? 16 : 0),
              (t.data[95] = i);
          } else if (38024 == (65423 & e))
            t.data[95] &= ~(1 << ((112 & e) >> 4));
          else if (63488 == (65032 & e)) {
            const a = 7 & e,
              d = (496 & e) >> 4;
            t.data[d] =
              (~(1 << a) & t.data[d]) | (((t.data[95] >> 6) & 1) << a);
          } else if (62464 == (64512 & e))
            t.data[95] & (1 << (7 & e)) ||
              ((t.pc = t.pc + (((504 & e) >> 3) - (512 & e ? 64 : 0))),
              t.cycles++);
          else if (61440 == (64512 & e))
            t.data[95] & (1 << (7 & e)) &&
              ((t.pc = t.pc + (((504 & e) >> 3) - (512 & e ? 64 : 0))),
              t.cycles++);
          else if (37896 == (65423 & e)) t.data[95] |= 1 << ((112 & e) >> 4);
          else if (64e3 == (65032 & e)) {
            const a = t.data[(496 & e) >> 4],
              d = 7 & e;
            t.data[95] = (191 & t.data[95]) | ((a >> d) & 1 ? 64 : 0);
          } else if (37902 == (65038 & e)) {
            const a = t.progMem[t.pc + 1] | ((1 & e) << 16) | ((496 & e) << 13),
              d = t.pc + 2,
              i = t.dataView.getUint16(93, !0),
              { pc22Bits: s } = t;
            (t.data[i] = 255 & d),
              (t.data[i - 1] = (d >> 8) & 255),
              s && (t.data[i - 2] = (d >> 16) & 255),
              t.dataView.setUint16(93, i - (s ? 3 : 2), !0),
              (t.pc = a - 1),
              (t.cycles += s ? 4 : 3);
          } else if (38912 == (65280 & e)) {
            const a = 248 & e,
              d = 7 & e,
              i = t.readData(32 + (a >> 3));
            t.writeData(32 + (a >> 3), i & ~(1 << d));
          } else if (37888 == (65039 & e)) {
            const a = (496 & e) >> 4,
              d = 255 - t.data[a];
            t.data[a] = d;
            let i = (225 & t.data[95]) | 1;
            (i |= d ? 0 : 2),
              (i |= 128 & d ? 4 : 0),
              (i |= ((i >> 2) & 1) ^ ((i >> 3) & 1) ? 16 : 0),
              (t.data[95] = i);
          } else if (5120 == (64512 & e)) {
            const a = t.data[(496 & e) >> 4],
              d = t.data[(15 & e) | ((512 & e) >> 5)],
              i = a - d;
            let s = 192 & t.data[95];
            (s |= i ? 0 : 2),
              (s |= 128 & i ? 4 : 0),
              (s |= 0 != ((a ^ d) & (a ^ i) & 128) ? 8 : 0),
              (s |= ((s >> 2) & 1) ^ ((s >> 3) & 1) ? 16 : 0),
              (s |= d > a ? 1 : 0),
              (s |= 1 & ((~a & d) | (d & i) | (i & ~a)) ? 32 : 0),
              (t.data[95] = s);
          } else if (1024 == (64512 & e)) {
            const a = t.data[(496 & e) >> 4],
              d = t.data[(15 & e) | ((512 & e) >> 5)];
            let i = t.data[95];
            const s = a - d - (1 & i);
            (i =
              (192 & i) |
              (!s && (i >> 1) & 1 ? 2 : 0) |
              (d + (1 & i) > a ? 1 : 0)),
              (i |= 128 & s ? 4 : 0),
              (i |= (a ^ d) & (a ^ s) & 128 ? 8 : 0),
              (i |= ((i >> 2) & 1) ^ ((i >> 3) & 1) ? 16 : 0),
              (i |= 1 & ((~a & d) | (d & s) | (s & ~a)) ? 32 : 0),
              (t.data[95] = i);
          } else if (12288 == (61440 & e)) {
            const a = t.data[16 + ((240 & e) >> 4)],
              d = (15 & e) | ((3840 & e) >> 4),
              i = a - d;
            let s = 192 & t.data[95];
            (s |= i ? 0 : 2),
              (s |= 128 & i ? 4 : 0),
              (s |= (a ^ d) & (a ^ i) & 128 ? 8 : 0),
              (s |= ((s >> 2) & 1) ^ ((s >> 3) & 1) ? 16 : 0),
              (s |= d > a ? 1 : 0),
              (s |= 1 & ((~a & d) | (d & i) | (i & ~a)) ? 32 : 0),
              (t.data[95] = s);
          } else if (4096 == (64512 & e)) {
            if (
              t.data[(496 & e) >> 4] === t.data[(15 & e) | ((512 & e) >> 5)]
            ) {
              const e = a(t.progMem[t.pc + 1]) ? 2 : 1;
              (t.pc += e), (t.cycles += e);
            }
          } else if (37898 == (65039 & e)) {
            const a = t.data[(496 & e) >> 4],
              d = a - 1;
            t.data[(496 & e) >> 4] = d;
            let i = 225 & t.data[95];
            (i |= d ? 0 : 2),
              (i |= 128 & d ? 4 : 0),
              (i |= 128 === a ? 8 : 0),
              (i |= ((i >> 2) & 1) ^ ((i >> 3) & 1) ? 16 : 0),
              (t.data[95] = i);
          } else if (38169 === e) {
            const a = t.pc + 1,
              e = t.dataView.getUint16(93, !0),
              d = t.data[60];
            (t.data[e] = 255 & a),
              (t.data[e - 1] = (a >> 8) & 255),
              t.dataView.setUint16(93, e - 2, !0),
              (t.pc = ((d << 16) | t.dataView.getUint16(30, !0)) - 1),
              (t.cycles += 3);
          } else if (37913 === e) {
            const a = t.data[60];
            (t.pc = ((a << 16) | t.dataView.getUint16(30, !0)) - 1), t.cycles++;
          } else if (38360 === e) {
            const a = t.data[59];
            (t.data[0] = t.progBytes[(a << 16) | t.dataView.getUint16(30, !0)]),
              (t.cycles += 2);
          } else if (36870 == (65039 & e)) {
            const a = t.data[59];
            (t.data[(496 & e) >> 4] =
              t.progBytes[(a << 16) | t.dataView.getUint16(30, !0)]),
              (t.cycles += 2);
          } else if (36871 == (65039 & e)) {
            const a = t.data[59],
              d = t.dataView.getUint16(30, !0);
            (t.data[(496 & e) >> 4] = t.progBytes[(a << 16) | d]),
              t.dataView.setUint16(30, d + 1, !0),
              65535 === d &&
                (t.data[59] = (a + 1) % (t.progBytes.length >> 16)),
              (t.cycles += 2);
          } else if (9216 == (64512 & e)) {
            const a =
              t.data[(496 & e) >> 4] ^ t.data[(15 & e) | ((512 & e) >> 5)];
            t.data[(496 & e) >> 4] = a;
            let d = 225 & t.data[95];
            (d |= a ? 0 : 2),
              (d |= 128 & a ? 4 : 0),
              (d |= ((d >> 2) & 1) ^ ((d >> 3) & 1) ? 16 : 0),
              (t.data[95] = d);
          } else if (776 == (65416 & e)) {
            const a = t.data[16 + ((112 & e) >> 4)],
              d = t.data[16 + (7 & e)],
              i = (a * d) << 1;
            t.dataView.setUint16(0, i, !0),
              (t.data[95] =
                (252 & t.data[95]) |
                (65535 & i ? 0 : 2) |
                ((a * d) & 32768 ? 1 : 0)),
              t.cycles++;
          } else if (896 == (65416 & e)) {
            const a = t.dataView.getInt8(16 + ((112 & e) >> 4)),
              d = t.dataView.getInt8(16 + (7 & e)),
              i = (a * d) << 1;
            t.dataView.setInt16(0, i, !0),
              (t.data[95] =
                (252 & t.data[95]) |
                (65535 & i ? 0 : 2) |
                ((a * d) & 32768 ? 1 : 0)),
              t.cycles++;
          } else if (904 == (65416 & e)) {
            const a = t.dataView.getInt8(16 + ((112 & e) >> 4)),
              d = t.data[16 + (7 & e)],
              i = (a * d) << 1;
            t.dataView.setInt16(0, i, !0),
              (t.data[95] =
                (252 & t.data[95]) |
                (65535 & i ? 2 : 0) |
                ((a * d) & 32768 ? 1 : 0)),
              t.cycles++;
          } else if (38153 === e) {
            const a = t.pc + 1,
              e = t.dataView.getUint16(93, !0),
              { pc22Bits: d } = t;
            (t.data[e] = 255 & a),
              (t.data[e - 1] = (a >> 8) & 255),
              d && (t.data[e - 2] = (a >> 16) & 255),
              t.dataView.setUint16(93, e - (d ? 3 : 2), !0),
              (t.pc = t.dataView.getUint16(30, !0) - 1),
              (t.cycles += d ? 3 : 2);
          } else if (37897 === e)
            (t.pc = t.dataView.getUint16(30, !0) - 1), t.cycles++;
          else if (45056 == (63488 & e)) {
            const a = t.readData(32 + ((15 & e) | ((1536 & e) >> 5)));
            t.data[(496 & e) >> 4] = a;
          } else if (37891 == (65039 & e)) {
            const a = t.data[(496 & e) >> 4],
              d = (a + 1) & 255;
            t.data[(496 & e) >> 4] = d;
            let i = 225 & t.data[95];
            (i |= d ? 0 : 2),
              (i |= 128 & d ? 4 : 0),
              (i |= 127 === a ? 8 : 0),
              (i |= ((i >> 2) & 1) ^ ((i >> 3) & 1) ? 16 : 0),
              (t.data[95] = i);
          } else if (37900 == (65038 & e))
            (t.pc =
              (t.progMem[t.pc + 1] | ((1 & e) << 16) | ((496 & e) << 13)) - 1),
              (t.cycles += 2);
          else if (37382 == (65039 & e)) {
            const a = (496 & e) >> 4,
              d = t.data[a],
              i = t.readData(t.dataView.getUint16(30, !0));
            t.writeData(t.dataView.getUint16(30, !0), i & (255 - d)),
              (t.data[a] = i);
          } else if (37381 == (65039 & e)) {
            const a = (496 & e) >> 4,
              d = t.data[a],
              i = t.readData(t.dataView.getUint16(30, !0));
            t.writeData(t.dataView.getUint16(30, !0), i | d), (t.data[a] = i);
          } else if (37383 == (65039 & e)) {
            const a = t.data[(496 & e) >> 4],
              d = t.readData(t.dataView.getUint16(30, !0));
            t.writeData(t.dataView.getUint16(30, !0), a ^ d),
              (t.data[(496 & e) >> 4] = d);
          } else if (57344 == (61440 & e))
            t.data[16 + ((240 & e) >> 4)] = (15 & e) | ((3840 & e) >> 4);
          else if (36864 == (65039 & e)) {
            t.cycles++;
            const a = t.readData(t.progMem[t.pc + 1]);
            (t.data[(496 & e) >> 4] = a), t.pc++;
          } else if (36876 == (65039 & e))
            t.cycles++,
              (t.data[(496 & e) >> 4] = t.readData(
                t.dataView.getUint16(26, !0)
              ));
          else if (36877 == (65039 & e)) {
            const a = t.dataView.getUint16(26, !0);
            t.cycles++,
              (t.data[(496 & e) >> 4] = t.readData(a)),
              t.dataView.setUint16(26, a + 1, !0);
          } else if (36878 == (65039 & e)) {
            const a = t.dataView.getUint16(26, !0) - 1;
            t.dataView.setUint16(26, a, !0),
              t.cycles++,
              (t.data[(496 & e) >> 4] = t.readData(a));
          } else if (32776 == (65039 & e))
            t.cycles++,
              (t.data[(496 & e) >> 4] = t.readData(
                t.dataView.getUint16(28, !0)
              ));
          else if (36873 == (65039 & e)) {
            const a = t.dataView.getUint16(28, !0);
            t.cycles++,
              (t.data[(496 & e) >> 4] = t.readData(a)),
              t.dataView.setUint16(28, a + 1, !0);
          } else if (36874 == (65039 & e)) {
            const a = t.dataView.getUint16(28, !0) - 1;
            t.dataView.setUint16(28, a, !0),
              t.cycles++,
              (t.data[(496 & e) >> 4] = t.readData(a));
          } else if (
            32776 == (53768 & e) &&
            (7 & e) | ((3072 & e) >> 7) | ((8192 & e) >> 8)
          )
            t.cycles++,
              (t.data[(496 & e) >> 4] = t.readData(
                t.dataView.getUint16(28, !0) +
                  ((7 & e) | ((3072 & e) >> 7) | ((8192 & e) >> 8))
              ));
          else if (32768 == (65039 & e))
            t.cycles++,
              (t.data[(496 & e) >> 4] = t.readData(
                t.dataView.getUint16(30, !0)
              ));
          else if (36865 == (65039 & e)) {
            const a = t.dataView.getUint16(30, !0);
            t.cycles++,
              (t.data[(496 & e) >> 4] = t.readData(a)),
              t.dataView.setUint16(30, a + 1, !0);
          } else if (36866 == (65039 & e)) {
            const a = t.dataView.getUint16(30, !0) - 1;
            t.dataView.setUint16(30, a, !0),
              t.cycles++,
              (t.data[(496 & e) >> 4] = t.readData(a));
          } else if (
            32768 == (53768 & e) &&
            (7 & e) | ((3072 & e) >> 7) | ((8192 & e) >> 8)
          )
            t.cycles++,
              (t.data[(496 & e) >> 4] = t.readData(
                t.dataView.getUint16(30, !0) +
                  ((7 & e) | ((3072 & e) >> 7) | ((8192 & e) >> 8))
              ));
          else if (38344 === e)
            (t.data[0] = t.progBytes[t.dataView.getUint16(30, !0)]),
              (t.cycles += 2);
          else if (36868 == (65039 & e))
            (t.data[(496 & e) >> 4] =
              t.progBytes[t.dataView.getUint16(30, !0)]),
              (t.cycles += 2);
          else if (36869 == (65039 & e)) {
            const a = t.dataView.getUint16(30, !0);
            (t.data[(496 & e) >> 4] = t.progBytes[a]),
              t.dataView.setUint16(30, a + 1, !0),
              (t.cycles += 2);
          } else if (37894 == (65039 & e)) {
            const a = t.data[(496 & e) >> 4],
              d = a >>> 1;
            t.data[(496 & e) >> 4] = d;
            let i = 224 & t.data[95];
            (i |= d ? 0 : 2),
              (i |= 1 & a),
              (i |= ((i >> 2) & 1) ^ (1 & i) ? 8 : 0),
              (i |= ((i >> 2) & 1) ^ ((i >> 3) & 1) ? 16 : 0),
              (t.data[95] = i);
          } else if (11264 == (64512 & e))
            t.data[(496 & e) >> 4] = t.data[(15 & e) | ((512 & e) >> 5)];
          else if (256 == (65280 & e)) {
            const a = 2 * (15 & e),
              d = 2 * ((240 & e) >> 4);
            (t.data[d] = t.data[a]), (t.data[d + 1] = t.data[a + 1]);
          } else if (39936 == (64512 & e)) {
            const a =
              t.data[(496 & e) >> 4] * t.data[(15 & e) | ((512 & e) >> 5)];
            t.dataView.setUint16(0, a, !0),
              (t.data[95] =
                (252 & t.data[95]) | (65535 & a ? 0 : 2) | (32768 & a ? 1 : 0)),
              t.cycles++;
          } else if (512 == (65280 & e)) {
            const a =
              t.dataView.getInt8(16 + ((240 & e) >> 4)) *
              t.dataView.getInt8(16 + (15 & e));
            t.dataView.setInt16(0, a, !0),
              (t.data[95] =
                (252 & t.data[95]) | (65535 & a ? 0 : 2) | (32768 & a ? 1 : 0)),
              t.cycles++;
          } else if (768 == (65416 & e)) {
            const a =
              t.dataView.getInt8(16 + ((112 & e) >> 4)) * t.data[16 + (7 & e)];
            t.dataView.setInt16(0, a, !0),
              (t.data[95] =
                (252 & t.data[95]) | (65535 & a ? 0 : 2) | (32768 & a ? 1 : 0)),
              t.cycles++;
          } else if (37889 == (65039 & e)) {
            const a = (496 & e) >> 4,
              d = t.data[a],
              i = 0 - d;
            t.data[a] = i;
            let s = 192 & t.data[95];
            (s |= i ? 0 : 2),
              (s |= 128 & i ? 4 : 0),
              (s |= 128 === i ? 8 : 0),
              (s |= ((s >> 2) & 1) ^ ((s >> 3) & 1) ? 16 : 0),
              (s |= i ? 1 : 0),
              (s |= 1 & (i | d) ? 32 : 0),
              (t.data[95] = s);
          } else if (0 === e);
          else if (10240 == (64512 & e)) {
            const a =
              t.data[(496 & e) >> 4] | t.data[(15 & e) | ((512 & e) >> 5)];
            t.data[(496 & e) >> 4] = a;
            let d = 225 & t.data[95];
            (d |= a ? 0 : 2),
              (d |= 128 & a ? 4 : 0),
              (d |= ((d >> 2) & 1) ^ ((d >> 3) & 1) ? 16 : 0),
              (t.data[95] = d);
          } else if (24576 == (61440 & e)) {
            const a =
              t.data[16 + ((240 & e) >> 4)] | (15 & e) | ((3840 & e) >> 4);
            t.data[16 + ((240 & e) >> 4)] = a;
            let d = 225 & t.data[95];
            (d |= a ? 0 : 2),
              (d |= 128 & a ? 4 : 0),
              (d |= ((d >> 2) & 1) ^ ((d >> 3) & 1) ? 16 : 0),
              (t.data[95] = d);
          } else if (47104 == (63488 & e))
            t.writeData(
              32 + ((15 & e) | ((1536 & e) >> 5)),
              t.data[(496 & e) >> 4]
            );
          else if (36879 == (65039 & e)) {
            const a = t.dataView.getUint16(93, !0) + 1;
            t.dataView.setUint16(93, a, !0),
              (t.data[(496 & e) >> 4] = t.data[a]),
              t.cycles++;
          } else if (37391 == (65039 & e)) {
            const a = t.dataView.getUint16(93, !0);
            (t.data[a] = t.data[(496 & e) >> 4]),
              t.dataView.setUint16(93, a - 1, !0),
              t.cycles++;
          } else if (53248 == (61440 & e)) {
            const a = (2047 & e) - (2048 & e ? 2048 : 0),
              d = t.pc + 1,
              i = t.dataView.getUint16(93, !0),
              { pc22Bits: s } = t;
            (t.data[i] = 255 & d),
              (t.data[i - 1] = (d >> 8) & 255),
              s && (t.data[i - 2] = (d >> 16) & 255),
              t.dataView.setUint16(93, i - (s ? 3 : 2), !0),
              (t.pc += a),
              (t.cycles += s ? 3 : 2);
          } else if (38152 === e) {
            const { pc22Bits: a } = t,
              e = t.dataView.getUint16(93, !0) + (a ? 3 : 2);
            t.dataView.setUint16(93, e, !0),
              (t.pc = (t.data[e - 1] << 8) + t.data[e] - 1),
              a && (t.pc |= t.data[e - 2] << 16),
              (t.cycles += a ? 4 : 3);
          } else if (38168 === e) {
            const { pc22Bits: a } = t,
              e = t.dataView.getUint16(93, !0) + (a ? 3 : 2);
            t.dataView.setUint16(93, e, !0),
              (t.pc = (t.data[e - 1] << 8) + t.data[e] - 1),
              a && (t.pc |= t.data[e - 2] << 16),
              (t.cycles += a ? 4 : 3),
              (t.data[95] |= 128);
          } else if (49152 == (61440 & e))
            (t.pc = t.pc + ((2047 & e) - (2048 & e ? 2048 : 0))), t.cycles++;
          else if (37895 == (65039 & e)) {
            const a = t.data[(496 & e) >> 4],
              d = (a >>> 1) | ((1 & t.data[95]) << 7);
            t.data[(496 & e) >> 4] = d;
            let i = 224 & t.data[95];
            (i |= d ? 0 : 2),
              (i |= 128 & d ? 4 : 0),
              (i |= 1 & a ? 1 : 0),
              (i |= ((i >> 2) & 1) ^ (1 & i) ? 8 : 0),
              (i |= ((i >> 2) & 1) ^ ((i >> 3) & 1) ? 16 : 0),
              (t.data[95] = i);
          } else if (2048 == (64512 & e)) {
            const a = t.data[(496 & e) >> 4],
              d = t.data[(15 & e) | ((512 & e) >> 5)];
            let i = t.data[95];
            const s = a - d - (1 & i);
            (t.data[(496 & e) >> 4] = s),
              (i =
                (192 & i) |
                (!s && (i >> 1) & 1 ? 2 : 0) |
                (d + (1 & i) > a ? 1 : 0)),
              (i |= 128 & s ? 4 : 0),
              (i |= (a ^ d) & (a ^ s) & 128 ? 8 : 0),
              (i |= ((i >> 2) & 1) ^ ((i >> 3) & 1) ? 16 : 0),
              (i |= 1 & ((~a & d) | (d & s) | (s & ~a)) ? 32 : 0),
              (t.data[95] = i);
          } else if (16384 == (61440 & e)) {
            const a = t.data[16 + ((240 & e) >> 4)],
              d = (15 & e) | ((3840 & e) >> 4);
            let i = t.data[95];
            const s = a - d - (1 & i);
            (t.data[16 + ((240 & e) >> 4)] = s),
              (i =
                (192 & i) |
                (!s && (i >> 1) & 1 ? 2 : 0) |
                (d + (1 & i) > a ? 1 : 0)),
              (i |= 128 & s ? 4 : 0),
              (i |= (a ^ d) & (a ^ s) & 128 ? 8 : 0),
              (i |= ((i >> 2) & 1) ^ ((i >> 3) & 1) ? 16 : 0),
              (i |= 1 & ((~a & d) | (d & s) | (s & ~a)) ? 32 : 0),
              (t.data[95] = i);
          } else if (39424 == (65280 & e)) {
            const a = 32 + ((248 & e) >> 3);
            t.writeData(a, t.readData(a) | (1 << (7 & e))), t.cycles++;
          } else if (39168 == (65280 & e)) {
            if (!(t.readData(32 + ((248 & e) >> 3)) & (1 << (7 & e)))) {
              const e = a(t.progMem[t.pc + 1]) ? 2 : 1;
              (t.cycles += e), (t.pc += e);
            }
          } else if (39680 == (65280 & e)) {
            if (t.readData(32 + ((248 & e) >> 3)) & (1 << (7 & e))) {
              const e = a(t.progMem[t.pc + 1]) ? 2 : 1;
              (t.cycles += e), (t.pc += e);
            }
          } else if (38656 == (65280 & e)) {
            const a = 2 * ((48 & e) >> 4) + 24,
              d = t.dataView.getUint16(a, !0),
              i = (15 & e) | ((192 & e) >> 2),
              s = d - i;
            t.dataView.setUint16(a, s, !0);
            let c = 192 & t.data[95];
            (c |= s ? 0 : 2),
              (c |= 32768 & s ? 4 : 0),
              (c |= d & ~s & 32768 ? 8 : 0),
              (c |= ((c >> 2) & 1) ^ ((c >> 3) & 1) ? 16 : 0),
              (c |= i > d ? 1 : 0),
              (c |= 1 & ((~d & i) | (i & s) | (s & ~d)) ? 32 : 0),
              (t.data[95] = c),
              t.cycles++;
          } else if (64512 == (65032 & e)) {
            if (!(t.data[(496 & e) >> 4] & (1 << (7 & e)))) {
              const e = a(t.progMem[t.pc + 1]) ? 2 : 1;
              (t.cycles += e), (t.pc += e);
            }
          } else if (65024 == (65032 & e)) {
            if (t.data[(496 & e) >> 4] & (1 << (7 & e))) {
              const e = a(t.progMem[t.pc + 1]) ? 2 : 1;
              (t.cycles += e), (t.pc += e);
            }
          } else if (38280 === e);
          else if (38376 === e);
          else if (38392 === e);
          else if (37376 == (65039 & e)) {
            const a = t.data[(496 & e) >> 4],
              d = t.progMem[t.pc + 1];
            t.writeData(d, a), t.pc++, t.cycles++;
          } else if (37388 == (65039 & e))
            t.writeData(t.dataView.getUint16(26, !0), t.data[(496 & e) >> 4]),
              t.cycles++;
          else if (37389 == (65039 & e)) {
            const a = t.dataView.getUint16(26, !0);
            t.writeData(a, t.data[(496 & e) >> 4]),
              t.dataView.setUint16(26, a + 1, !0),
              t.cycles++;
          } else if (37390 == (65039 & e)) {
            const a = t.data[(496 & e) >> 4],
              d = t.dataView.getUint16(26, !0) - 1;
            t.dataView.setUint16(26, d, !0), t.writeData(d, a), t.cycles++;
          } else if (33288 == (65039 & e))
            t.writeData(t.dataView.getUint16(28, !0), t.data[(496 & e) >> 4]),
              t.cycles++;
          else if (37385 == (65039 & e)) {
            const a = t.data[(496 & e) >> 4],
              d = t.dataView.getUint16(28, !0);
            t.writeData(d, a), t.dataView.setUint16(28, d + 1, !0), t.cycles++;
          } else if (37386 == (65039 & e)) {
            const a = t.data[(496 & e) >> 4],
              d = t.dataView.getUint16(28, !0) - 1;
            t.dataView.setUint16(28, d, !0), t.writeData(d, a), t.cycles++;
          } else if (
            33288 == (53768 & e) &&
            (7 & e) | ((3072 & e) >> 7) | ((8192 & e) >> 8)
          )
            t.writeData(
              t.dataView.getUint16(28, !0) +
                ((7 & e) | ((3072 & e) >> 7) | ((8192 & e) >> 8)),
              t.data[(496 & e) >> 4]
            ),
              t.cycles++;
          else if (33280 == (65039 & e))
            t.writeData(t.dataView.getUint16(30, !0), t.data[(496 & e) >> 4]),
              t.cycles++;
          else if (37377 == (65039 & e)) {
            const a = t.dataView.getUint16(30, !0);
            t.writeData(a, t.data[(496 & e) >> 4]),
              t.dataView.setUint16(30, a + 1, !0),
              t.cycles++;
          } else if (37378 == (65039 & e)) {
            const a = t.data[(496 & e) >> 4],
              d = t.dataView.getUint16(30, !0) - 1;
            t.dataView.setUint16(30, d, !0), t.writeData(d, a), t.cycles++;
          } else if (
            33280 == (53768 & e) &&
            (7 & e) | ((3072 & e) >> 7) | ((8192 & e) >> 8)
          )
            t.writeData(
              t.dataView.getUint16(30, !0) +
                ((7 & e) | ((3072 & e) >> 7) | ((8192 & e) >> 8)),
              t.data[(496 & e) >> 4]
            ),
              t.cycles++;
          else if (6144 == (64512 & e)) {
            const a = t.data[(496 & e) >> 4],
              d = t.data[(15 & e) | ((512 & e) >> 5)],
              i = a - d;
            t.data[(496 & e) >> 4] = i;
            let s = 192 & t.data[95];
            (s |= i ? 0 : 2),
              (s |= 128 & i ? 4 : 0),
              (s |= (a ^ d) & (a ^ i) & 128 ? 8 : 0),
              (s |= ((s >> 2) & 1) ^ ((s >> 3) & 1) ? 16 : 0),
              (s |= d > a ? 1 : 0),
              (s |= 1 & ((~a & d) | (d & i) | (i & ~a)) ? 32 : 0),
              (t.data[95] = s);
          } else if (20480 == (61440 & e)) {
            const a = t.data[16 + ((240 & e) >> 4)],
              d = (15 & e) | ((3840 & e) >> 4),
              i = a - d;
            t.data[16 + ((240 & e) >> 4)] = i;
            let s = 192 & t.data[95];
            (s |= i ? 0 : 2),
              (s |= 128 & i ? 4 : 0),
              (s |= (a ^ d) & (a ^ i) & 128 ? 8 : 0),
              (s |= ((s >> 2) & 1) ^ ((s >> 3) & 1) ? 16 : 0),
              (s |= d > a ? 1 : 0),
              (s |= 1 & ((~a & d) | (d & i) | (i & ~a)) ? 32 : 0),
              (t.data[95] = s);
          } else if (37890 == (65039 & e)) {
            const a = (496 & e) >> 4,
              d = t.data[a];
            t.data[a] = ((15 & d) << 4) | ((240 & d) >>> 4);
          } else if (38312 === e);
          else if (37380 == (65039 & e)) {
            const a = (496 & e) >> 4,
              d = t.data[a],
              i = t.data[t.dataView.getUint16(30, !0)];
            (t.data[t.dataView.getUint16(30, !0)] = d), (t.data[a] = i);
          }
          (t.pc = (t.pc + 1) % t.progMem.length), t.cycles++;
        }
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.avrInstruction = t);
      },
      {},
    ],
    x6vY: [
      function (require, module, exports) {
        "use strict";
        function t(t, e) {
          const a = t.dataView.getUint16(93, !0);
          (t.data[a] = 255 & t.pc),
            (t.data[a - 1] = (t.pc >> 8) & 255),
            t.dataView.setUint16(93, a - 2, !0),
            (t.data[95] &= 127),
            (t.cycles += 2),
            (t.pc = e);
        }
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.avrInterrupt = t);
      },
      {},
    ],
    lglE: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.AVRIOPort =
            exports.PinOverrideMode =
            exports.PinState =
            exports.portLConfig =
            exports.portKConfig =
            exports.portJConfig =
            exports.portHConfig =
            exports.portGConfig =
            exports.portFConfig =
            exports.portEConfig =
            exports.portDConfig =
            exports.portCConfig =
            exports.portBConfig =
            exports.portAConfig =
              void 0);
        const t = { PIN: 32, DDR: 33, PORT: 34 };
        exports.portAConfig = t;
        const o = { PIN: 35, DDR: 36, PORT: 37 };
        exports.portBConfig = o;
        const e = { PIN: 38, DDR: 39, PORT: 40 };
        exports.portCConfig = e;
        const i = { PIN: 41, DDR: 42, PORT: 43 };
        exports.portDConfig = i;
        const s = { PIN: 44, DDR: 45, PORT: 46 };
        exports.portEConfig = s;
        const r = { PIN: 47, DDR: 48, PORT: 49 };
        exports.portFConfig = r;
        const n = { PIN: 50, DDR: 51, PORT: 52 };
        exports.portGConfig = n;
        const p = { PIN: 256, DDR: 257, PORT: 258 };
        exports.portHConfig = p;
        const a = { PIN: 259, DDR: 260, PORT: 261 };
        exports.portJConfig = a;
        const P = { PIN: 262, DDR: 263, PORT: 264 };
        exports.portKConfig = P;
        const h = { PIN: 265, DDR: 266, PORT: 267 };
        var l, d;
        (exports.portLConfig = h),
          (exports.PinState = l),
          (function (t) {
            (t[(t.Low = 0)] = "Low"),
              (t[(t.High = 1)] = "High"),
              (t[(t.Input = 2)] = "Input"),
              (t[(t.InputPullUp = 3)] = "InputPullUp");
          })(l || (exports.PinState = l = {})),
          (exports.PinOverrideMode = d),
          (function (t) {
            (t[(t.None = 0)] = "None"),
              (t[(t.Enable = 1)] = "Enable"),
              (t[(t.Set = 2)] = "Set"),
              (t[(t.Clear = 3)] = "Clear"),
              (t[(t.Toggle = 4)] = "Toggle");
          })(d || (exports.PinOverrideMode = d = {}));
        class R {
          constructor(t, o) {
            (this.cpu = t),
              (this.portConfig = o),
              (this.listeners = []),
              (this.pinValue = 0),
              (this.overrideMask = 255),
              (this.lastValue = 0),
              (this.lastDdr = 0),
              (t.writeHooks[o.DDR] = (e) => {
                const i = t.data[o.PORT];
                return (
                  (t.data[o.DDR] = e),
                  this.updatePinRegister(i, e),
                  this.writeGpio(i, e),
                  !0
                );
              }),
              (t.writeHooks[o.PORT] = (e) => {
                const i = t.data[o.DDR];
                return (
                  (t.data[o.PORT] = e),
                  this.updatePinRegister(e, i),
                  this.writeGpio(e, i),
                  !0
                );
              }),
              (t.writeHooks[o.PIN] = (e) => {
                const i = t.data[o.PORT],
                  s = t.data[o.DDR],
                  r = i ^ e;
                return (
                  (t.data[o.PORT] = r),
                  (t.data[o.PIN] = (t.data[o.PIN] & ~s) | (r & s)),
                  this.writeGpio(r, s),
                  !0
                );
              }),
              (t.gpioTimerHooks[o.PORT] = (e, i) => {
                const s = 1 << e;
                if (i == d.None) this.overrideMask |= s;
                else
                  switch (((this.overrideMask &= ~s), i)) {
                    case d.Enable:
                      (this.overrideValue &= ~s),
                        (this.overrideValue |= t.data[o.PORT] & s);
                      break;
                    case d.Set:
                      this.overrideValue |= s;
                      break;
                    case d.Clear:
                      this.overrideValue &= ~s;
                      break;
                    case d.Toggle:
                      this.overrideValue ^= s;
                  }
                this.writeGpio(t.data[o.PORT], t.data[o.DDR]);
              });
          }
          addListener(t) {
            this.listeners.push(t);
          }
          removeListener(t) {
            this.listeners = this.listeners.filter((o) => o !== t);
          }
          pinState(t) {
            const o = this.cpu.data[this.portConfig.DDR],
              e = this.cpu.data[this.portConfig.PORT],
              i = 1 << t;
            return o & i
              ? this.lastValue & i
                ? l.High
                : l.Low
              : e & i
              ? l.InputPullUp
              : l.Input;
          }
          setPin(t, o) {
            const e = 1 << t;
            (this.pinValue &= ~e),
              o && (this.pinValue |= e),
              this.updatePinRegister(
                this.cpu.data[this.portConfig.PORT],
                this.cpu.data[this.portConfig.DDR]
              );
          }
          updatePinRegister(t, o) {
            this.cpu.data[this.portConfig.PIN] = (this.pinValue & ~o) | (t & o);
          }
          writeGpio(t, o) {
            const e = ((t & this.overrideMask) | this.overrideValue) & o,
              i = this.lastValue;
            if (e !== i || o !== this.lastDdr) {
              (this.lastValue = e), (this.lastDdr = o);
              for (const t of this.listeners) t(e, i);
            }
          }
        }
        exports.AVRIOPort = R;
      },
      {},
    ],
    nPWZ: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.AVRTimer =
            exports.timer2Config =
            exports.timer1Config =
            exports.timer0Config =
              void 0);
        var t = require("../cpu/interrupt"),
          e = require("./gpio");
        const i = { 0: 0, 1: 1, 2: 8, 3: 64, 4: 256, 5: 1024, 6: 0, 7: 0 },
          o = 1,
          s = 2,
          r = 4,
          c = 1,
          p = 2,
          h = 4,
          n = {
            bits: 8,
            captureInterrupt: 0,
            compAInterrupt: 28,
            compBInterrupt: 30,
            ovfInterrupt: 32,
            TIFR: 53,
            OCRA: 71,
            OCRB: 72,
            ICR: 0,
            TCNT: 70,
            TCCRA: 68,
            TCCRB: 69,
            TCCRC: 0,
            TIMSK: 110,
            dividers: i,
            compPortA: e.portDConfig.PORT,
            compPinA: 6,
            compPortB: e.portDConfig.PORT,
            compPinB: 5,
          };
        exports.timer0Config = n;
        const a = {
          bits: 16,
          captureInterrupt: 20,
          compAInterrupt: 22,
          compBInterrupt: 24,
          ovfInterrupt: 26,
          TIFR: 54,
          OCRA: 136,
          OCRB: 138,
          ICR: 134,
          TCNT: 132,
          TCCRA: 128,
          TCCRB: 129,
          TCCRC: 130,
          TIMSK: 111,
          dividers: i,
          compPortA: e.portBConfig.PORT,
          compPinA: 1,
          compPortB: e.portBConfig.PORT,
          compPinB: 2,
        };
        exports.timer1Config = a;
        const C = {
          bits: 8,
          captureInterrupt: 0,
          compAInterrupt: 14,
          compBInterrupt: 16,
          ovfInterrupt: 18,
          TIFR: 55,
          OCRA: 179,
          OCRB: 180,
          ICR: 0,
          TCNT: 178,
          TCCRA: 176,
          TCCRB: 177,
          TCCRC: 0,
          TIMSK: 112,
          dividers: { 0: 0, 1: 1, 2: 8, 3: 32, 4: 64, 5: 128, 6: 256, 7: 1024 },
          compPortA: e.portBConfig.PORT,
          compPinA: 3,
          compPortB: e.portDConfig.PORT,
          compPinB: 3,
        };
        var m, u, d;
        (exports.timer2Config = C),
          (function (t) {
            (t[(t.Normal = 0)] = "Normal"),
              (t[(t.PWMPhaseCorrect = 1)] = "PWMPhaseCorrect"),
              (t[(t.CTC = 2)] = "CTC"),
              (t[(t.FastPWM = 3)] = "FastPWM"),
              (t[(t.PWMPhaseFrequencyCorrect = 4)] =
                "PWMPhaseFrequencyCorrect"),
              (t[(t.Reserved = 5)] = "Reserved");
          })(m || (m = {})),
          (function (t) {
            (t[(t.Max = 0)] = "Max"),
              (t[(t.Top = 1)] = "Top"),
              (t[(t.Bottom = 2)] = "Bottom");
          })(u || (u = {})),
          (function (t) {
            (t[(t.Immediate = 0)] = "Immediate"),
              (t[(t.Top = 1)] = "Top"),
              (t[(t.Bottom = 2)] = "Bottom");
          })(d || (d = {}));
        const T = 1,
          P = 2,
          B = [
            [m.Normal, 255, d.Immediate, u.Max],
            [m.PWMPhaseCorrect, 255, d.Top, u.Bottom],
            [m.CTC, T, d.Immediate, u.Max],
            [m.FastPWM, 255, d.Bottom, u.Max],
            [m.Reserved, 255, d.Immediate, u.Max],
            [m.PWMPhaseCorrect, T, d.Top, u.Bottom],
            [m.Reserved, 255, d.Immediate, u.Max],
            [m.FastPWM, T, d.Bottom, u.Top],
          ],
          M = [
            [m.Normal, 65535, d.Immediate, u.Max],
            [m.PWMPhaseCorrect, 255, d.Top, u.Bottom],
            [m.PWMPhaseCorrect, 511, d.Top, u.Bottom],
            [m.PWMPhaseCorrect, 1023, d.Top, u.Bottom],
            [m.CTC, T, d.Immediate, u.Max],
            [m.FastPWM, 255, d.Bottom, u.Top],
            [m.FastPWM, 511, d.Bottom, u.Top],
            [m.FastPWM, 1023, d.Bottom, u.Top],
            [m.PWMPhaseFrequencyCorrect, P, d.Bottom, u.Bottom],
            [m.PWMPhaseFrequencyCorrect, T, d.Bottom, u.Bottom],
            [m.PWMPhaseCorrect, P, d.Top, u.Bottom],
            [m.PWMPhaseCorrect, T, d.Top, u.Bottom],
            [m.CTC, P, d.Immediate, u.Max],
            [m.Reserved, 65535, d.Immediate, u.Max],
            [m.FastPWM, P, d.Bottom, u.Top],
            [m.FastPWM, T, d.Bottom, u.Top],
          ];
        function R(t) {
          switch (t) {
            case 1:
              return e.PinOverrideMode.Toggle;
            case 2:
              return e.PinOverrideMode.Clear;
            case 3:
              return e.PinOverrideMode.Set;
            default:
              return e.PinOverrideMode.Enable;
          }
        }
        class g {
          constructor(t, i) {
            if (
              ((this.cpu = t),
              (this.config = i),
              (this.lastCycle = 0),
              (this.ocrA = 0),
              (this.ocrB = 0),
              (this.icr = 0),
              (this.tcnt = 0),
              (this.tcntUpdated = !1),
              (this.countingUp = !0),
              (this.highByteTemp = 0),
              this.updateWGMConfig(),
              (this.cpu.readHooks[i.TCNT] = (t) => (
                this.tick(),
                16 === this.config.bits &&
                  (this.cpu.data[t + 1] = this.tcnt >> 8),
                (this.cpu.data[t] = 255 & this.tcnt)
              )),
              (this.cpu.writeHooks[i.TCNT] = (t) => {
                (this.tcnt = (this.highByteTemp << 8) | t),
                  (this.tcntUpdated = !0),
                  this.timerUpdated();
              }),
              (this.cpu.writeHooks[i.OCRA] = (t) => {
                this.ocrA = (this.highByteTemp << 8) | t;
              }),
              (this.cpu.writeHooks[i.OCRB] = (t) => {
                this.ocrB = (this.highByteTemp << 8) | t;
              }),
              (this.cpu.writeHooks[i.ICR] = (t) => {
                this.icr = (this.highByteTemp << 8) | t;
              }),
              16 === this.config.bits)
            ) {
              const t = (t) => {
                this.highByteTemp = t;
              };
              (this.cpu.writeHooks[i.TCNT + 1] = t),
                (this.cpu.writeHooks[i.OCRA + 1] = t),
                (this.cpu.writeHooks[i.OCRB + 1] = t),
                (this.cpu.writeHooks[i.ICR + 1] = t);
            }
            (t.writeHooks[i.TCCRA] = (t) => (
              (this.cpu.data[i.TCCRA] = t),
              (this.compA = (t >> 6) & 3),
              this.updateCompA(
                this.compA ? e.PinOverrideMode.Enable : e.PinOverrideMode.None
              ),
              (this.compB = (t >> 4) & 3),
              this.updateCompB(
                this.compB ? e.PinOverrideMode.Enable : e.PinOverrideMode.None
              ),
              this.updateWGMConfig(),
              !0
            )),
              (t.writeHooks[i.TCCRB] = (t) => (
                (this.cpu.data[i.TCCRB] = t), this.updateWGMConfig(), !0
              ));
          }
          reset() {
            (this.lastCycle = 0), (this.ocrA = 0), (this.ocrB = 0);
          }
          get TIFR() {
            return this.cpu.data[this.config.TIFR];
          }
          set TIFR(t) {
            this.cpu.data[this.config.TIFR] = t;
          }
          get TCCRA() {
            return this.cpu.data[this.config.TCCRA];
          }
          get TCCRB() {
            return this.cpu.data[this.config.TCCRB];
          }
          get TIMSK() {
            return this.cpu.data[this.config.TIMSK];
          }
          get CS() {
            return 7 & this.TCCRB;
          }
          get WGM() {
            const t = 16 === this.config.bits ? 24 : 8;
            return ((this.TCCRB & t) >> 1) | (3 & this.TCCRA);
          }
          get TOP() {
            switch (this.topValue) {
              case T:
                return this.ocrA;
              case P:
                return this.icr;
              default:
                return this.topValue;
            }
          }
          updateWGMConfig() {
            const t = 16 === this.config.bits ? M : B,
              [e, i] = t[this.WGM];
            (this.timerMode = e), (this.topValue = i);
          }
          tick() {
            const e = this.config.dividers[this.CS],
              i = this.cpu.cycles - this.lastCycle;
            if (e && i >= e) {
              const t = Math.floor(i / e);
              this.lastCycle += t * e;
              const s = this.tcnt,
                { timerMode: r } = this,
                c =
                  r === m.PWMPhaseCorrect || r === m.PWMPhaseFrequencyCorrect
                    ? this.phasePwmCount(s, t)
                    : (s + t) % (this.TOP + 1);
              this.tcntUpdated || ((this.tcnt = c), this.timerUpdated()),
                (r === m.Normal || r === m.FastPWM) &&
                  s > c &&
                  (this.TIFR |= o);
            }
            if (((this.tcntUpdated = !1), this.cpu.interruptsEnabled)) {
              const { TIFR: e, TIMSK: i } = this;
              e & o &&
                i & c &&
                ((0, t.avrInterrupt)(this.cpu, this.config.ovfInterrupt),
                (this.TIFR &= ~o)),
                e & s &&
                  i & p &&
                  ((0, t.avrInterrupt)(this.cpu, this.config.compAInterrupt),
                  (this.TIFR &= ~s)),
                e & r &&
                  i & h &&
                  ((0, t.avrInterrupt)(this.cpu, this.config.compBInterrupt),
                  (this.TIFR &= ~r));
            }
          }
          phasePwmCount(t, e) {
            for (; e > 0; )
              this.countingUp
                ? ++t !== this.TOP || this.tcntUpdated || (this.countingUp = !1)
                : --t ||
                  this.tcntUpdated ||
                  ((this.countingUp = !0), (this.TIFR |= o)),
                e--;
            return t;
          }
          timerUpdated() {
            const t = this.tcnt;
            this.ocrA &&
              t === this.ocrA &&
              ((this.TIFR |= s),
              this.timerMode === m.CTC && ((this.tcnt = 0), (this.TIFR |= o)),
              this.compA && this.updateCompPin(this.compA, "A")),
              this.ocrB &&
                t === this.ocrB &&
                ((this.TIFR |= r),
                this.compB && this.updateCompPin(this.compB, "B"));
          }
          updateCompPin(t, i) {
            let o = e.PinOverrideMode.None;
            const s = 3 === t,
              r = this.countingUp === s;
            switch (this.timerMode) {
              case m.Normal:
              case m.CTC:
              case m.FastPWM:
                o = R(t);
                break;
              case m.PWMPhaseCorrect:
              case m.PWMPhaseFrequencyCorrect:
                o = r ? e.PinOverrideMode.Set : e.PinOverrideMode.Clear;
            }
            o !== e.PinOverrideMode.None &&
              ("A" === i ? this.updateCompA(o) : this.updateCompB(o));
          }
          updateCompA(t) {
            const { compPortA: e, compPinA: i } = this.config,
              o = this.cpu.gpioTimerHooks[e];
            o && o(i, t, e);
          }
          updateCompB(t) {
            const { compPortB: e, compPinB: i } = this.config,
              o = this.cpu.gpioTimerHooks[e];
            o && o(i, t, e);
          }
        }
        exports.AVRTimer = g;
      },
      { "../cpu/interrupt": "x6vY", "./gpio": "lglE" },
    ],
    ZpWN: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.AVRUSART = exports.usart0Config = void 0);
        var t = require("../cpu/interrupt");
        const i = {
          rxCompleteInterrupt: 36,
          dataRegisterEmptyInterrupt: 38,
          txCompleteInterrupt: 40,
          UCSRA: 192,
          UCSRB: 193,
          UCSRC: 194,
          UBRRL: 196,
          UBRRH: 197,
          UDR: 198,
        };
        exports.usart0Config = i;
        const s = 128,
          r = 64,
          e = 32,
          n = 16,
          a = 8,
          u = 4,
          c = 2,
          h = 1,
          o = 128,
          p = 64,
          R = 32,
          f = 16,
          C = 8,
          U = 4,
          d = 2,
          g = 1,
          S = 128,
          l = 64,
          A = 32,
          B = 16,
          m = 8,
          x = 4,
          I = 2,
          T = 1;
        class H {
          constructor(t, i, s) {
            (this.cpu = t),
              (this.config = i),
              (this.freqMHz = s),
              (this.onByteTransmit = null),
              (this.onLineTransmit = null),
              (this.lineBuffer = ""),
              (this.cpu.writeHooks[i.UCSRA] = (t) => (
                (this.cpu.data[i.UCSRA] = t | e | r), !0
              )),
              (this.cpu.writeHooks[i.UCSRB] = (t, s) => {
                t & C && !(s & C) && (this.cpu.data[i.UCSRA] |= e);
              }),
              (this.cpu.writeHooks[i.UDR] = (t) => {
                if (
                  (this.onByteTransmit && this.onByteTransmit(t),
                  this.onLineTransmit)
                ) {
                  const i = String.fromCharCode(t);
                  "\n" === i
                    ? (this.onLineTransmit(this.lineBuffer),
                      (this.lineBuffer = ""))
                    : (this.lineBuffer += i);
                }
                this.cpu.data[i.UCSRA] |= e | r;
              });
          }
          tick() {
            if (this.cpu.interruptsEnabled) {
              const i = this.cpu.data[this.config.UCSRA],
                n = this.cpu.data[this.config.UCSRB];
              i & e &&
                n & R &&
                ((0, t.avrInterrupt)(
                  this.cpu,
                  this.config.dataRegisterEmptyInterrupt
                ),
                (this.cpu.data[this.config.UCSRA] &= ~e)),
                n & r &&
                  n & p &&
                  ((0, t.avrInterrupt)(
                    this.cpu,
                    this.config.txCompleteInterrupt
                  ),
                  (this.cpu.data[this.config.UCSRA] &= ~r)),
                n & s &&
                  i & o &&
                  ((0, t.avrInterrupt)(
                    this.cpu,
                    this.config.rxCompleteInterrupt
                  ),
                  (this.cpu.data[this.config.UCSRA] &= ~s));
            }
          }
          get baudRate() {
            const t =
                (this.cpu.data[this.config.UBRRH] << 8) |
                this.cpu.data[this.config.UBRRL],
              i = this.cpu.data[this.config.UCSRA] & c ? 8 : 16;
            return Math.floor(this.freqMHz / (i * (1 + t)));
          }
          get bitsPerChar() {
            switch (
              ((this.cpu.data[this.config.UCSRA] & (x | I)) >> 1) |
              (this.cpu.data[this.config.UCSRB] & U)
            ) {
              case 0:
                return 5;
              case 1:
                return 6;
              case 2:
                return 7;
              case 3:
                return 8;
              default:
              case 7:
                return 9;
            }
          }
        }
        exports.AVRUSART = H;
      },
      { "../cpu/interrupt": "x6vY" },
    ],
    dpkw: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.AVRTWI =
            exports.NoopTWIEventHandler =
            exports.twiConfig =
              void 0);
        var t = require("../cpu/interrupt");
        const e = 128,
          s = 64,
          i = 32,
          a = 16,
          c = 8,
          r = 4,
          n = 1,
          o = 248,
          h = 2,
          u = 1,
          p = 3,
          d = 254,
          l = 1,
          T = 0,
          W = 248,
          f = 8,
          R = 16,
          S = 24,
          w = 32,
          g = 40,
          v = 48,
          x = 56,
          C = 64,
          H = 72,
          m = 80,
          I = 88,
          k = {
            twiInterrupt: 48,
            TWBR: 184,
            TWSR: 185,
            TWAR: 186,
            TWDR: 187,
            TWCR: 188,
            TWAMR: 189,
          };
        exports.twiConfig = k;
        class y {
          constructor(t) {
            this.twi = t;
          }
          start() {
            this.twi.completeStart();
          }
          stop() {
            this.twi.completeStop();
          }
          connectToSlave() {
            this.twi.completeConnect(!1);
          }
          writeByte() {
            this.twi.completeWrite(!1);
          }
          readByte() {
            this.twi.completeRead(255);
          }
        }
        exports.NoopTWIEventHandler = y;
        class B {
          constructor(t, c, n) {
            (this.cpu = t),
              (this.config = c),
              (this.freqMHz = n),
              (this.eventHandler = new y(this)),
              (this.nextTick = null),
              this.updateStatus(W),
              (this.cpu.writeHooks[c.TWCR] = (t) => {
                const n = t & e;
                n && (t &= ~e);
                const { status: o } = this;
                if (n && t & r) {
                  const e = this.cpu.data[this.config.TWDR];
                  return (
                    (this.nextTick = () => {
                      if (t & i) this.eventHandler.start(o !== W);
                      else if (t & a) this.eventHandler.stop();
                      else if (o === f)
                        this.eventHandler.connectToSlave(e >> 1, !(1 & e));
                      else if (o === S || o === g)
                        this.eventHandler.writeByte(e);
                      else if (o === C || o === m) {
                        const e = !!(t & s);
                        this.eventHandler.readByte(e);
                      }
                    }),
                    (this.cpu.data[c.TWCR] = t),
                    !0
                  );
                }
              });
          }
          tick() {
            if (
              (this.nextTick && (this.nextTick(), (this.nextTick = null)),
              this.cpu.interruptsEnabled)
            ) {
              const { TWCR: s, twiInterrupt: i } = this.config;
              this.cpu.data[s] & n &&
                this.cpu.data[s] & e &&
                ((0, t.avrInterrupt)(this.cpu, i), (this.cpu.data[s] &= ~e));
            }
          }
          get prescaler() {
            switch (this.cpu.data[this.config.TWSR] & p) {
              case 0:
                return 1;
              case 1:
                return 4;
              case 2:
                return 16;
              case 3:
                return 64;
            }
            throw new Error("Invalid prescaler value!");
          }
          get sclFrequency() {
            return (
              this.freqMHz /
              (16 + 2 * this.cpu.data[this.config.TWBR] * this.prescaler)
            );
          }
          completeStart() {
            this.updateStatus(this.status === W ? f : R);
          }
          completeStop() {
            (this.cpu.data[this.config.TWCR] &= ~a), this.updateStatus(W);
          }
          completeConnect(t) {
            1 & this.cpu.data[this.config.TWDR]
              ? this.updateStatus(t ? C : H)
              : this.updateStatus(t ? S : w);
          }
          completeWrite(t) {
            this.updateStatus(t ? g : v);
          }
          completeRead(t) {
            const e = !!(this.cpu.data[this.config.TWCR] & s);
            (this.cpu.data[this.config.TWDR] = t), this.updateStatus(e ? m : I);
          }
          get status() {
            return this.cpu.data[this.config.TWSR] & o;
          }
          updateStatus(t) {
            const { TWCR: s, TWSR: i } = this.config;
            (this.cpu.data[i] = (this.cpu.data[i] & ~o) | t),
              (this.cpu.data[s] |= e);
          }
        }
        exports.AVRTWI = B;
      },
      { "../cpu/interrupt": "x6vY" },
    ],
    jrrw: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ADC = void 0);
        class t {
          constructor(t) {
            (this.cpu = t),
              (this.analogvalues = {}),
              (this.ADMUX = 124),
              (this.ADCSRA = 122),
              (this.ADCH = 121),
              (this.ADCL = 120),
              (t.writeHooks[this.ADCSRA] = (t) => {
                if (64 & t) {
                  let s = this.cpu.data[this.ADMUX];
                  const a =
                    (s &= 15) in this.analogvalues
                      ? this.analogvalues[s]
                      : Math.floor(1024 * Math.random());
                  return (
                    (this.cpu.data[this.ADCL] = 255 & a),
                    (this.cpu.data[this.ADCH] = (a >> 8) & 3),
                    (this.cpu.data[this.ADCSRA] = -65 & t),
                    !0
                  );
                }
              });
          }
          setAnalogValue(t, s) {
            this.analogvalues[15 & t] = 1023 & s;
          }
        }
        exports.ADC = t;
      },
      {},
    ],
    QCba: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });
        var e = {
          CPU: !0,
          ICPU: !0,
          CPUMemoryHook: !0,
          CPUMemoryHooks: !0,
          avrInstruction: !0,
          avrInterrupt: !0,
          AVRTimer: !0,
          timer0Config: !0,
          timer1Config: !0,
          timer2Config: !0,
          AVRIOPort: !0,
          GPIOListener: !0,
          AVRPortConfig: !0,
          portAConfig: !0,
          portBConfig: !0,
          portCConfig: !0,
          portDConfig: !0,
          portEConfig: !0,
          portFConfig: !0,
          portGConfig: !0,
          portHConfig: !0,
          portJConfig: !0,
          portKConfig: !0,
          portLConfig: !0,
          PinState: !0,
          AVRUSART: !0,
          usart0Config: !0,
        };
        Object.defineProperty(exports, "CPU", {
          enumerable: !0,
          get: function () {
            return r.CPU;
          },
        }),
          Object.defineProperty(exports, "ICPU", {
            enumerable: !0,
            get: function () {
              return r.ICPU;
            },
          }),
          Object.defineProperty(exports, "CPUMemoryHook", {
            enumerable: !0,
            get: function () {
              return r.CPUMemoryHook;
            },
          }),
          Object.defineProperty(exports, "CPUMemoryHooks", {
            enumerable: !0,
            get: function () {
              return r.CPUMemoryHooks;
            },
          }),
          Object.defineProperty(exports, "avrInstruction", {
            enumerable: !0,
            get: function () {
              return t.avrInstruction;
            },
          }),
          Object.defineProperty(exports, "avrInterrupt", {
            enumerable: !0,
            get: function () {
              return n.avrInterrupt;
            },
          }),
          Object.defineProperty(exports, "AVRTimer", {
            enumerable: !0,
            get: function () {
              return o.AVRTimer;
            },
          }),
          Object.defineProperty(exports, "timer0Config", {
            enumerable: !0,
            get: function () {
              return o.timer0Config;
            },
          }),
          Object.defineProperty(exports, "timer1Config", {
            enumerable: !0,
            get: function () {
              return o.timer1Config;
            },
          }),
          Object.defineProperty(exports, "timer2Config", {
            enumerable: !0,
            get: function () {
              return o.timer2Config;
            },
          }),
          Object.defineProperty(exports, "AVRIOPort", {
            enumerable: !0,
            get: function () {
              return i.AVRIOPort;
            },
          }),
          Object.defineProperty(exports, "GPIOListener", {
            enumerable: !0,
            get: function () {
              return i.GPIOListener;
            },
          }),
          Object.defineProperty(exports, "AVRPortConfig", {
            enumerable: !0,
            get: function () {
              return i.AVRPortConfig;
            },
          }),
          Object.defineProperty(exports, "portAConfig", {
            enumerable: !0,
            get: function () {
              return i.portAConfig;
            },
          }),
          Object.defineProperty(exports, "portBConfig", {
            enumerable: !0,
            get: function () {
              return i.portBConfig;
            },
          }),
          Object.defineProperty(exports, "portCConfig", {
            enumerable: !0,
            get: function () {
              return i.portCConfig;
            },
          }),
          Object.defineProperty(exports, "portDConfig", {
            enumerable: !0,
            get: function () {
              return i.portDConfig;
            },
          }),
          Object.defineProperty(exports, "portEConfig", {
            enumerable: !0,
            get: function () {
              return i.portEConfig;
            },
          }),
          Object.defineProperty(exports, "portFConfig", {
            enumerable: !0,
            get: function () {
              return i.portFConfig;
            },
          }),
          Object.defineProperty(exports, "portGConfig", {
            enumerable: !0,
            get: function () {
              return i.portGConfig;
            },
          }),
          Object.defineProperty(exports, "portHConfig", {
            enumerable: !0,
            get: function () {
              return i.portHConfig;
            },
          }),
          Object.defineProperty(exports, "portJConfig", {
            enumerable: !0,
            get: function () {
              return i.portJConfig;
            },
          }),
          Object.defineProperty(exports, "portKConfig", {
            enumerable: !0,
            get: function () {
              return i.portKConfig;
            },
          }),
          Object.defineProperty(exports, "portLConfig", {
            enumerable: !0,
            get: function () {
              return i.portLConfig;
            },
          }),
          Object.defineProperty(exports, "PinState", {
            enumerable: !0,
            get: function () {
              return i.PinState;
            },
          }),
          Object.defineProperty(exports, "AVRUSART", {
            enumerable: !0,
            get: function () {
              return u.AVRUSART;
            },
          }),
          Object.defineProperty(exports, "usart0Config", {
            enumerable: !0,
            get: function () {
              return u.usart0Config;
            },
          });
        var r = require("./cpu/cpu"),
          t = require("./cpu/instruction"),
          n = require("./cpu/interrupt"),
          o = require("./peripherals/timer"),
          i = require("./peripherals/gpio"),
          u = require("./peripherals/usart"),
          p = require("./peripherals/twi");
        Object.keys(p).forEach(function (r) {
          "default" !== r &&
            "__esModule" !== r &&
            (Object.prototype.hasOwnProperty.call(e, r) ||
              Object.defineProperty(exports, r, {
                enumerable: !0,
                get: function () {
                  return p[r];
                },
              }));
        });
        var f = require("./peripherals/adc");
        Object.keys(f).forEach(function (r) {
          "default" !== r &&
            "__esModule" !== r &&
            (Object.prototype.hasOwnProperty.call(e, r) ||
              Object.defineProperty(exports, r, {
                enumerable: !0,
                get: function () {
                  return f[r];
                },
              }));
        });
      },
      {
        "./cpu/cpu": "MkOI",
        "./cpu/instruction": "deE9",
        "./cpu/interrupt": "x6vY",
        "./peripherals/timer": "nPWZ",
        "./peripherals/gpio": "lglE",
        "./peripherals/usart": "ZpWN",
        "./peripherals/twi": "dpkw",
        "./peripherals/adc": "jrrw",
      },
    ],
  },
  {},
  ["QCba"],
  "AVR8"
);
//# sourceMappingURL=/index.js.map



