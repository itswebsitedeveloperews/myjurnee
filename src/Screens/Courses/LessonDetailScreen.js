import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS } from '../../Common/Constants/colors'
import RenderHtml from 'react-native-render-html';
import LessonNavBar from '../Components/LessonNavBar'
import { windowWidth } from '../../Utils/Dimentions'
import { FONTS } from '../../Common/Constants/fonts'


const source = {
    html: `
  <div class="ld-tabs ld-tab-count-1">
	
	<div class="ld-tabs-content">
		
							<div class="ld-tab-content ld-visible" id="ld-tab-content-223">
											
<p><em>A Registered Dietician’s Practical Guide to Navigating Social Eating Without Sabotaging Your Goals</em></p>



<h2 class="wp-block-heading">Welcome to Your Social Success Revolution!</h2>



<p>Hey there, social butterfly! Welcome to what might be the most liberating course you’ll ever take for weight loss success. I’m absolutely thrilled you’re here because we’re about to tackle one of the biggest challenges people face on their weight loss journey – how to maintain your goals while still enjoying a rich, social life!</p>



<p>You know what? So many people think that losing weight means becoming a social hermit, turning down invitations, or being “that person” who makes everyone else feel awkward about their food choices. But I’m here to tell you that’s complete rubbish! You can absolutely maintain an active social life AND achieve your weight loss goals.</p>



<p>As a registered dietician, I’ve helped thousands of people navigate everything from pub nights to wedding receptions, from work lunches to family gatherings, all while staying true to their health goals. The secret isn’t avoiding social situations – it’s learning how to navigate them like a pro!</p>



<h2 class="wp-block-heading">What You’ll Master in This Course</h2>



<p>By the end of this empowering journey, you’ll be able to:</p>



<ul class="wp-block-list">
<li><strong>Communicate confidently</strong> with friends and family about your health goals</li>



<li><strong>Handle peer pressure</strong> with grace and maintain your boundaries</li>



<li><strong>Make smart choices</strong> at any UK restaurant, pub, or takeaway</li>



<li><strong>Navigate group meals</strong> without feeling deprived or awkward</li>



<li><strong>Choose better drinks</strong> (both alcoholic and non-alcoholic) that support your goals</li>



<li><strong>Enjoy social eating</strong> while staying on track with your weight loss</li>



<li><strong>Feel confident</strong> in any social eating situation</li>
</ul>



<h2 class="wp-block-heading">Who This Course Is For</h2>



<p>This course is perfect for you if:</p>



<ul class="wp-block-list">
<li>You love socializing but worry it’s sabotaging your weight loss</li>



<li>You feel awkward or different when trying to eat healthily around others</li>



<li>You struggle with peer pressure around food and drinks</li>



<li>You want practical strategies for real UK social eating situations</li>



<li>You’re tired of feeling like you have to choose between your social life and your health goals</li>



<li>You want to feel confident and comfortable in any eating situation</li>
</ul>
			</div>

			
	</div> <!--/.ld-tabs-content-->

</div>
    `
};

const arrData = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
]

const LessonDetailScreen = (props) => {

    const renderPrevButton = () => {
        return (
            <TouchableOpacity style={styles.controlButtons} key={1}>
                <Text>Prev</Text>
            </TouchableOpacity>
        )
    }

    const renderNextButton = () => {
        return (
            <TouchableOpacity style={styles.controlButtons} key={2}>
                <Text>Next</Text>
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.pr_blue} />
            <View style={{ paddingHorizontal: 20 }}>
                <LessonNavBar
                    onBackPress={() => props.navigation.goBack()}
                    rightComponents={[renderPrevButton(), renderNextButton()]}
                />
            </View>

            {/* Scrollable lesson container */}
            <ScrollView
                style={{ flex: 1, paddingHorizontal: 15, }}
                showsVerticalScrollIndicator={false}
            >
                {/* Lesson Title */}
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText} numberOfLines={3}>
                        Communication and Confidence – Owning Your Health Journey
                    </Text>
                </View>

                {/* Lesson Number Container */}
                <View style={styles.lessonNumContainer}>
                    <Text style={styles.lessonNumText} numberOfLines={1}>
                        Lesson 1 of 4
                    </Text>
                </View>


                {/* HTML Content of the lesson */}
                <View style={styles.htmlContainer}>
                    <RenderHtml
                        contentWidth={windowWidth}
                        source={source}
                    />
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

export default LessonDetailScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    controlButtons: {
        backgroundColor: '#E0E0E0',
        width: windowWidth / 6,
        marginVertical: 2,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 5
    },
    titleContainer: {
        marginTop: 20
    },
    lessonNumContainer: {
        marginTop: 10
    },
    titleText: {
        fontFamily: FONTS.URBANIST_BOLD,
        fontSize: 24,
        color: COLORS.textColor,
        textAlign: 'left'
    },
    lessonNumText: {
        fontFamily: FONTS.URBANIST_MEDIUM,
        fontSize: 14,
        color: COLORS.textColor44,
        textAlign: 'left'
    },
    htmlContainer: {
        marginTop: 20,
        paddingBottom: 50
    }
})