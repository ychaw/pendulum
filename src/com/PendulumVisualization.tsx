import Two from 'two.js'
import { DoublePendulum } from '../sim/double-pendulum'

function createAnimation() {
    let elem = document.getElementById('pendulum') as HTMLElement;
    let two = new Two().appendTo(elem);

    let doublePendulum = new DoublePendulum({
        theta: [
            Math.PI / 4,
            Math.PI / 4,
        ],
        l: [100, 100],
        m: [10, 10],
        g: 1.2,
    });

    two.bind('update', function (frameCount) {

        doublePendulum.tick();

        two.clear();

        let f = two.makeLine(0, 0, doublePendulum.x[0], doublePendulum.y[0]);
        let s = two.makeLine(doublePendulum.x[0], doublePendulum.y[0], doublePendulum.x[1], doublePendulum.y[1]);
        f.stroke = '#FFFFFF';
        s.stroke = '#FFFFFF';


    }).play();
}


export default createAnimation;