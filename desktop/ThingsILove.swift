// "Things I Love" — a small native macOS app for Monty's pinboard.
//
// Two actions:
//   • Add a New Entry  → creates a draft row from a URL and enriches it
//                        (scripts/add-love.ts).
//   • Update Entries   → re-enriches blanks and refreshes the live site
//                        (scripts/refresh-loves.ts), for hand edits in Notion.
//
// Single source file: the same SwiftUI drawing renders both the in-window logo
// and, via `--make-icons`, the app icon PNGs. Build steps live in
// desktop/build-app.sh.

import AppKit
import SwiftUI

// The project this app drives. Hardcoded on purpose (personal, single machine).
let PROJECT_DIR = "/Users/Montster/MSizzle Personal Website"

// MARK: - Brand palette (matches the site: paper / ink / vermilion)

extension Color {
    static let paper = Color(red: 250 / 255, green: 249 / 255, blue: 247 / 255)
    static let ink = Color(red: 23 / 255, green: 23 / 255, blue: 23 / 255)
    static let vermilion = Color(red: 229 / 255, green: 65 / 255, blue: 31 / 255)
    static let hair = Color(red: 0.87, green: 0.86, blue: 0.83)
}

// MARK: - The heart mark (ink with a hard vermilion offset: brutalist, no gradient)

struct HeartShape: Shape {
    func path(in rect: CGRect) -> Path {
        let w = rect.width, h = rect.height
        var p = Path()
        p.move(to: CGPoint(x: w / 2, y: h))
        p.addCurve(
            to: CGPoint(x: 0, y: h / 4),
            control1: CGPoint(x: w / 2, y: h * 3 / 4),
            control2: CGPoint(x: 0, y: h / 2))
        p.addArc(
            center: CGPoint(x: w / 4, y: h / 4), radius: w / 4,
            startAngle: .radians(.pi), endAngle: .radians(0), clockwise: false)
        p.addArc(
            center: CGPoint(x: 3 * w / 4, y: h / 4), radius: w / 4,
            startAngle: .radians(.pi), endAngle: .radians(0), clockwise: false)
        p.addCurve(
            to: CGPoint(x: w / 2, y: h),
            control1: CGPoint(x: w, y: h / 2),
            control2: CGPoint(x: w / 2, y: h * 3 / 4))
        p.closeSubpath()
        return p.offsetBy(dx: rect.minX, dy: rect.minY)
    }
}

struct HeartMark: View {
    var body: some View {
        GeometryReader { geo in
            let s = min(geo.size.width, geo.size.height)
            let side = s * 0.82
            let d = s * 0.085
            ZStack {
                HeartShape().fill(Color.vermilion)
                    .frame(width: side, height: side)
                    .offset(x: d, y: d)
                HeartShape().fill(Color.ink)
                    .frame(width: side, height: side)
            }
            .frame(width: s, height: s)
        }
    }
}

// The app icon: heart on a cream rounded square with a crisp ink keyline.
struct IconView: View {
    var body: some View {
        GeometryReader { geo in
            let s = min(geo.size.width, geo.size.height)
            ZStack {
                RoundedRectangle(cornerRadius: s * 0.225, style: .continuous)
                    .fill(Color.paper)
                RoundedRectangle(cornerRadius: s * 0.225, style: .continuous)
                    .strokeBorder(Color.ink, lineWidth: s * 0.022)
                HeartMark().frame(width: s * 0.5, height: s * 0.5)
                    .offset(y: -s * 0.02)
            }
            .padding(s * 0.06)
            .frame(width: s, height: s)
        }
    }
}

// MARK: - Running the tsx scripts

func shellEscape(_ s: String) -> String {
    "'" + s.replacingOccurrences(of: "'", with: "'\\''") + "'"
}

func runCommand(_ command: String, done: @escaping (Bool, String) -> Void) {
    DispatchQueue.global(qos: .userInitiated).async {
        let proc = Process()
        proc.executableURL = URL(fileURLWithPath: "/bin/zsh")
        proc.arguments = ["-c", command]
        proc.currentDirectoryURL = URL(fileURLWithPath: PROJECT_DIR)
        var env = ProcessInfo.processInfo.environment
        env["PATH"] = "/opt/homebrew/bin:/usr/bin:/bin:" + (env["PATH"] ?? "")
        proc.environment = env

        let outPipe = Pipe()
        proc.standardOutput = outPipe
        proc.standardError = Pipe()  // discarded; scripts route status to stdout

        do {
            try proc.run()
        } catch {
            DispatchQueue.main.async { done(false, "Could not start the task.") }
            return
        }
        let data = outPipe.fileHandleForReading.readDataToEndOfFile()
        proc.waitUntilExit()
        let text = String(data: data, encoding: .utf8) ?? ""
        let last = text.split(whereSeparator: \.isNewline).last.map(String.init) ?? "Done."
        DispatchQueue.main.async { done(proc.terminationStatus == 0, last) }
    }
}

// MARK: - State

@MainActor
final class AppState: ObservableObject {
    @Published var url = ""
    @Published var status = "Paste a link to add it, or refresh the site."
    @Published var busy = false
    @Published var ok = true

    var canAdd: Bool {
        !busy && !url.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }

    func add() {
        let u = url.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !u.isEmpty, !busy else { return }
        busy = true
        ok = true
        status = "Adding and enriching…"
        runCommand("npx tsx scripts/add-love.ts \(shellEscape(u)) 2>/dev/null") {
            [weak self] ok, msg in
            guard let self else { return }
            self.busy = false
            self.ok = ok
            self.status = msg
            if ok { self.url = "" }
        }
    }

    func refresh() {
        guard !busy else { return }
        busy = true
        ok = true
        status = "Refreshing the site…"
        runCommand("npx tsx scripts/refresh-loves.ts 2>/dev/null") {
            [weak self] ok, msg in
            guard let self else { return }
            self.busy = false
            self.ok = ok
            self.status = msg
        }
    }
}

// MARK: - Brutalist offset-solid button

struct OffsetSolidStyle: ButtonStyle {
    let filled: Bool
    let enabled: Bool

    func makeBody(configuration: Configuration) -> some View {
        let pressed = configuration.isPressed && enabled
        let fg: Color = filled ? .paper : .ink
        let face: Color = filled ? .vermilion : .paper
        return ZStack {
            RoundedRectangle(cornerRadius: 11, style: .continuous)
                .fill(Color.ink)
                .offset(x: 4, y: 4)
            ZStack {
                RoundedRectangle(cornerRadius: 11, style: .continuous).fill(face)
                RoundedRectangle(cornerRadius: 11, style: .continuous)
                    .strokeBorder(Color.ink, lineWidth: 2)
                configuration.label
                    .font(.system(size: 15, weight: .bold))
                    .foregroundColor(fg)
            }
            .offset(x: pressed ? 4 : 0, y: pressed ? 4 : 0)
        }
        .frame(height: 48)
        .padding(.trailing, 4)
        .padding(.bottom, 4)
        .animation(.easeOut(duration: 0.08), value: pressed)
    }
}

// MARK: - Window content

struct RootView: View {
    @ObservedObject var state: AppState

    var body: some View {
        VStack(spacing: 0) {
            VStack(spacing: 16) {
                HeartMark().frame(width: 72, height: 72)
                VStack(spacing: 3) {
                    Text("Things I Love")
                        .font(.system(size: 25, weight: .heavy))
                        .foregroundColor(.ink)
                    Text("Add to Monty's pinboard")
                        .font(.system(size: 13, weight: .medium))
                        .foregroundColor(.ink.opacity(0.45))
                }
            }
            .padding(.top, 38)

            Spacer(minLength: 26)

            VStack(spacing: 12) {
                TextField("https://…", text: $state.url)
                    .textFieldStyle(.plain)
                    .font(.system(size: 14))
                    .padding(.horizontal, 14)
                    .frame(height: 44)
                    .background(
                        RoundedRectangle(cornerRadius: 10, style: .continuous)
                            .fill(Color.white)
                    )
                    .overlay(
                        RoundedRectangle(cornerRadius: 10, style: .continuous)
                            .strokeBorder(Color.hair, lineWidth: 1.5)
                    )
                    .disabled(state.busy)
                    .onSubmit(state.add)

                Button("Add a New Entry", action: state.add)
                    .buttonStyle(OffsetSolidStyle(filled: true, enabled: state.canAdd))
                    .disabled(!state.canAdd)
                    .opacity(state.canAdd ? 1 : 0.4)

                Button("Update Entries", action: state.refresh)
                    .buttonStyle(OffsetSolidStyle(filled: false, enabled: !state.busy))
                    .disabled(state.busy)
                    .opacity(state.busy ? 0.4 : 1)
            }
            .padding(.horizontal, 30)

            Spacer(minLength: 18)

            HStack(spacing: 8) {
                if state.busy {
                    ProgressView().controlSize(.small).scaleEffect(0.85)
                }
                Text(state.status)
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(state.ok ? .ink.opacity(0.55) : .vermilion)
                    .lineLimit(2)
                    .multilineTextAlignment(.center)
                    .fixedSize(horizontal: false, vertical: true)
            }
            .frame(minHeight: 38)
            .padding(.horizontal, 26)
            .padding(.bottom, 22)
        }
        .frame(width: 384, height: 470)
        .background(Color.paper)
        .buttonStyle(.plain)
    }
}

// MARK: - Icon generation (`ThingsILove --make-icons <dir>`)

@MainActor
func makeIcons(to dir: String) {
    let fm = FileManager.default
    let iconset = dir + "/AppIcon.iconset"
    try? fm.createDirectory(atPath: iconset, withIntermediateDirectories: true)

    func writePNG<V: View>(_ view: V, px: Int, to path: String) {
        let renderer = ImageRenderer(content: view.frame(width: CGFloat(px), height: CGFloat(px)))
        renderer.scale = 1
        guard let cg = renderer.cgImage else { return }
        let rep = NSBitmapImageRep(cgImage: cg)
        rep.size = NSSize(width: px, height: px)
        if let data = rep.representation(using: .png, properties: [:]) {
            try? data.write(to: URL(fileURLWithPath: path))
        }
    }

    let specs: [(pt: Int, scale: Int)] = [
        (16, 1), (16, 2), (32, 1), (32, 2), (128, 1),
        (128, 2), (256, 1), (256, 2), (512, 1), (512, 2),
    ]
    for spec in specs {
        let px = spec.pt * spec.scale
        let name = spec.scale == 1 ? "icon_\(spec.pt)x\(spec.pt).png" : "icon_\(spec.pt)x\(spec.pt)@2x.png"
        writePNG(IconView(), px: px, to: iconset + "/" + name)
    }
    writePNG(HeartMark(), px: 256, to: dir + "/logo.png")
    print("wrote iconset to \(iconset)")
}

// Render the window content to a PNG for offscreen visual review.
@MainActor
func makePreview(to path: String) {
    let renderer = ImageRenderer(content: RootView(state: AppState()))
    renderer.scale = 2
    guard let cg = renderer.cgImage else { return }
    let rep = NSBitmapImageRep(cgImage: cg)
    if let data = rep.representation(using: .png, properties: [:]) {
        try? data.write(to: URL(fileURLWithPath: path))
    }
    print("wrote preview to \(path)")
}

// MARK: - App lifecycle

final class AppDelegate: NSObject, NSApplicationDelegate {
    var window: NSWindow!

    func applicationDidFinishLaunching(_ notification: Notification) {
        let state = AppState()
        let hosting = NSHostingController(rootView: RootView(state: state))
        window = NSWindow(contentViewController: hosting)
        window.styleMask = [.titled, .closable, .miniaturizable, .fullSizeContentView]
        window.titleVisibility = .hidden
        window.titlebarAppearsTransparent = true
        window.isMovableByWindowBackground = true
        window.backgroundColor = NSColor(
            calibratedRed: 250 / 255, green: 249 / 255, blue: 247 / 255, alpha: 1)
        window.title = "Things I Love"
        window.setContentSize(NSSize(width: 384, height: 470))
        window.center()
        window.makeKeyAndOrderFront(nil)
        NSApp.activate(ignoringOtherApps: true)
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        true
    }
}

// MARK: - Entry point

let arguments = CommandLine.arguments
if let idx = arguments.firstIndex(of: "--make-icons"), idx + 1 < arguments.count {
    let app = NSApplication.shared
    app.setActivationPolicy(.accessory)
    MainActor.assumeIsolated { makeIcons(to: arguments[idx + 1]) }
    exit(0)
} else if let idx = arguments.firstIndex(of: "--preview"), idx + 1 < arguments.count {
    let app = NSApplication.shared
    app.setActivationPolicy(.accessory)
    MainActor.assumeIsolated { makePreview(to: arguments[idx + 1]) }
    exit(0)
} else {
    let app = NSApplication.shared
    let delegate = AppDelegate()
    app.delegate = delegate
    app.setActivationPolicy(.regular)
    app.run()
}
