
import { Gravity, MatterBody } from "./ui/gravity";

export function GravityLanding() {
    return (
        <div className="w-full h-full min-h-[500px] flex flex-col relative font-azeretMono bg-slate-50">
            <div className="pt-20 text-4xl sm:text-5xl md:text-6xl text-slate-900 w-full text-center font-bold">
                ADAPTIVE AI
            </div>
            <p className="pt-4 text-base sm:text-xl md:text-2xl text-slate-600 w-full text-center z-10">
                components made with:
            </p>
            <Gravity gravity={{ x: 0, y: 1 }} className="w-full h-full absolute top-0 left-0">
                <MatterBody
                    matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
                    x="30%"
                    y="10%"
                >
                    <div className="text-xl sm:text-2xl md:text-3xl bg-[#0015ff] text-white rounded-full hover:cursor-pointer px-8 py-4 shadow-lg">
                        react
                    </div>
                </MatterBody>
                <MatterBody
                    matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
                    x="30%"
                    y="30%"
                >
                    <div className="text-xl sm:text-2xl md:text-3xl bg-[#E794DA] text-white rounded-full hover:cursor-grab px-8 py-4 shadow-lg">
                        typescript
                    </div>
                </MatterBody>
                <MatterBody
                    matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
                    x="40%"
                    y="20%"
                    angle={10}
                >
                    <div className="text-xl sm:text-2xl md:text-3xl bg-[#1f464d] text-white rounded-full hover:cursor-grab px-8 py-4 shadow-lg">
                        groq-api
                    </div>
                </MatterBody>
                <MatterBody
                    matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
                    x="75%"
                    y="10%"
                >
                    <div className="text-xl sm:text-2xl md:text-3xl bg-[#ff5941] text-white rounded-full hover:cursor-grab px-8 py-4 shadow-lg">
                        tailwind
                    </div>
                </MatterBody>
                <MatterBody
                    matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
                    x="80%"
                    y="20%"
                >
                    <div className="text-xl sm:text-2xl md:text-3xl bg-orange-500 text-white rounded-full hover:cursor-grab px-8 py-4 shadow-lg">
                        vite
                    </div>
                </MatterBody>
                <MatterBody
                    matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
                    x="50%"
                    y="10%"
                >
                    <div className="text-xl sm:text-2xl md:text-3xl bg-[#ffd726] text-black rounded-full hover:cursor-grab px-8 py-4 shadow-lg">
                        matter-js
                    </div>
                </MatterBody>
            </Gravity>
        </div>
    );
}
