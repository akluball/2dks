import { Context, setup, cleanup } from '../context';
import {
    selectAddParticleAction,
    selectNoneGravitySimulator,
    selectElasticCollisionSimulator,
    selectNoneCollisionSimulator,
    getVelocity,
    ParticleBuilder
} from '../actions';
import { getStepButton } from '../element-getters';
import { getCenter } from '../util';

describe('elastic collision simulator', function() {
    beforeEach(setup);
    beforeEach(async function(this: Context) {
        await selectNoneGravitySimulator(this.driver);
        await selectElasticCollisionSimulator(this.driver);
        await selectAddParticleAction(this.driver);
    });
    afterEach(cleanup);

    it('vertical collision plane', async function(this: Context) {
        const a = await new ParticleBuilder(this.driver).position({ x: 200, y: 200 })
                                                        .radius(5)
                                                        .mass(5)
                                                        .velocity({ x: 20 }).build();
        const b = await new ParticleBuilder(this.driver).position({ x: 240, y: 200 })
                                                        .radius(5)
                                                        .mass(15)
                                                        .velocity({ x: -40 }).build();
        await getStepButton(this.driver).click();
        expect(await getCenter(a)).toEqual({ x: 175, y: 200 });
        expect(await getCenter(b)).toEqual({ x: 215, y: 200 });
        expect(await getVelocity(a)).toEqual({ x: -70, y: 0 });
        expect(await getVelocity(b)).toEqual({ x: -10, y: 0 });
    });

    it('horizontal collision plane', async function(this: Context) {
        const a = await new ParticleBuilder(this.driver).position({ x: 200, y: 200 })
                                                        .radius(5)
                                                        .mass(5)
                                                        .velocity({ y: -20 }).build();
        const b = await new ParticleBuilder(this.driver).position({ x: 200, y: 240 })
                                                        .radius(5)
                                                        .mass(15)
                                                        .velocity({ y: 40 }).build();
        await getStepButton(this.driver).click();
        expect(await getCenter(a)).toEqual({ x: 200, y: 175 });
        expect(await getCenter(b)).toEqual({ x: 200, y: 215 });
        expect(await getVelocity(a)).toEqual({ x: 0, y: 70 });
        expect(await getVelocity(b)).toEqual({ x: 0, y: 10 });
    });

    it('nonparallel velocities', async function(this: Context) {
        const a = await new ParticleBuilder(this.driver).position({ x: 200, y: 210 })
                                                        .radius(5)
                                                        .mass(5)
                                                        .velocity({ x: 20, y: 20 }).build();
        const b = await new ParticleBuilder(this.driver).position({ x: 240, y: 200 })
                                                        .radius(5)
                                                        .mass(15)
                                                        .velocity({ x: -40 }).build();
        await getStepButton(this.driver).click();
        expect(await getCenter(a)).toEqual({ x: 175, y: 190 });
        expect(await getCenter(b)).toEqual({ x: 215, y: 200 });
        expect(await getVelocity(a)).toEqual({ x: -70, y: 20 });
        expect(await getVelocity(b)).toEqual({ x: -10, y: 0 });
    });

    it('multiple', async function(this: Context) {
        const a = await new ParticleBuilder(this.driver).position({ x: 200, y: 200 })
                                                        .radius(5)
                                                        .mass(10)
                                                        .velocity({ x: 40 }).build();
        const b = await new ParticleBuilder(this.driver).position({ x: 280, y: 200 })
                                                        .radius(5)
                                                        .mass(10).build();
        const c = await new ParticleBuilder(this.driver).position({ x: 310, y: 200 })
                                                        .radius(5)
                                                        .mass(10)
                                                        .velocity({ x: -80 }).build();
        await getStepButton(this.driver).click();
        expect(await getCenter(a)).toEqual({ x: 210, y: 200 });
        expect(await getCenter(b)).toEqual({ x: 250, y: 200 });
        expect(await getCenter(c)).toEqual({ x: 290, y: 200 });
        expect(await getVelocity(a)).toEqual({ x: -80, y: 0 });
        expect(await getVelocity(b)).toEqual({ x: 40, y: 0 });
        expect(await getVelocity(c)).toEqual({ x: 0, y: 0 });
    });

    it('vertical collision plane concurrent', async function(this: Context) {
        const a = await new ParticleBuilder(this.driver).position({ x: 200, y: 200 })
                                                        .radius(5)
                                                        .mass(10)
                                                        .velocity({ x: 40 }).build();
        const b = await new ParticleBuilder(this.driver).position({ x: 230, y: 200 })
                                                        .radius(5)
                                                        .mass(10).build();
        const c = await new ParticleBuilder(this.driver).position({ x: 260, y: 200 })
                                                        .radius(5)
                                                        .mass(10)
                                                        .velocity({ x: -40 }).build();
        await getStepButton(this.driver).click();
        expect(await getCenter(a)).toEqual({ x: 200, y: 200 });
        expect(await getCenter(b)).toEqual({ x: 230, y: 200 });
        expect(await getCenter(c)).toEqual({ x: 260, y: 200 });
        expect(await getVelocity(a)).toEqual({ x: -40, y: 0 });
        expect(await getVelocity(b)).toEqual({ x: 0, y: 0 });
        expect(await getVelocity(c)).toEqual({ x: 40, y: 0 });
    });

    it('horizontal collision plane concurrent', async function(this: Context) {
        const a = await new ParticleBuilder(this.driver).position({ x: 200, y: 200 })
                                                        .radius(5)
                                                        .mass(10)
                                                        .velocity({ y: -40 }).build();
        const b = await new ParticleBuilder(this.driver).position({ x: 200, y: 230 })
                                                        .radius(5)
                                                        .mass(10).build();
        const c = await new ParticleBuilder(this.driver).position({ x: 200, y: 260 })
                                                        .radius(5)
                                                        .mass(10)
                                                        .velocity({ y: 40 }).build();
        await getStepButton(this.driver).click();
        expect(await getCenter(a)).toEqual({ x: 200, y: 200 });
        expect(await getCenter(b)).toEqual({ x: 200, y: 230 });
        expect(await getCenter(c)).toEqual({ x: 200, y: 260 });
        expect(await getVelocity(a)).toEqual({ x: 0, y: 40 });
        expect(await getVelocity(b)).toEqual({ x: 0, y: 0 });
        expect(await getVelocity(c)).toEqual({ x: 0, y: -40 });
    });

});

describe('none collision simulator', function() {
    beforeEach(setup);
    beforeEach(async function(this: Context) {
        await selectNoneGravitySimulator(this.driver);
        await selectNoneCollisionSimulator(this.driver);
        await selectAddParticleAction(this.driver);
    });
    afterEach(cleanup);

    it('ignores collisions', async function(this: Context) {
        const a = await new ParticleBuilder(this.driver).position({ x: 200, y: 200 })
                                                        .radius(5)
                                                        .mass(10)
                                                        .velocity({ x: 40 }).build();
        const b = await new ParticleBuilder(this.driver).position({ x: 240, y: 200 })
                                                        .radius(5)
                                                        .mass(10)
                                                        .velocity({ x: -80 }).build();
        await getStepButton(this.driver).click();
        expect(await getCenter(a)).toEqual({ x: 240, y: 200 });
        expect(await getCenter(b)).toEqual({ x: 160, y: 200 });
        expect(await getVelocity(a)).toEqual({ x: 40, y: 0 });
        expect(await getVelocity(b)).toEqual({ x: -80, y: 0 });
    });
});
